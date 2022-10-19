#!/bin/env/python3

# Python3 script to send captions to Link Encoder 608

# (C) Illinois Board of Trustees 2021 - 2022
# All rights reserved.
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal with the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

#    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimers.
#    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimers in the documentation and/or other materials provided with the distribution.
#    Neither the names of University of Illinois, nor the names of its contributors may be used to endorse or promote products derived from this Software without specific prior written permission.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS WITH THE SOFTWARE.

import socket
from time import sleep
from datetime import datetime
import sys
import io


max_character_number = 32 # maximum number of user submitted characters allowed per caption line
sleep_bypass_duration = 3 # number of seconds to sleep before sending the bypass command

csEncoder = 'sce492.cs.illinois.edu'
botEncoder = '192.102.230.114'
defaultPort = '10003'


def sendNewsWire(s, newswire):
    #print("    Configuring for newswire mode")
    s.sendall(newswire)

def sendControlCodes(s, rollupcode, fieldinsertmode):
    s.sendall(fieldinsertmode + rollupcode) # sends the control codes to configure how the text is displayed

def clearScreen(s, bypass):
    s.sendall(bypass) # send bypass command to clear the text on screen

def sendBypass(s, bypass):
    global sleep_bypass_duration

    sleep(sleep_bypass_duration) # sleep
    s.sendall(bypass) # send bypass command to clear the text on screen

def sendData(s, data):
    timestamp = datetime.now().strftime("%H:%M:%S")
    mesg = str(data,'ascii').replace('\r','').replace('\n','')
    print(f"    {timestamp} sending \"{mesg}\"")
    s.sendall(data) # sends the actual user submitted captions

# from https://stackoverflow.com/questions/18854620/whats-the-best-way-to-split-a-string-into-fixed-length-chunks-and-work-with-the/18854817
def chunkstring(string, length):
    return (string[0+i:length+i] for i in range(0, len(string), length)) # breaks a string into 32 character chunks

def main():
    global max_character_number
    
    host = 'localhost'
    port = defaultPort

    channel = None # determines which fieldinsertmode to use

    if (int(port) == 10001): # port 10001 is the first channel according to the manual
        channel = "Channel 1"
    elif (int(port) == 10002): # port 10002 is the second channel according to the manual
        channel = "Channel 2"
    else:
        # for use with other link encoders where the channels are mapped to different ports
        channel = "Channel 2"

    # allows the user to determine how unsupported characters should be handled by the system
    #print("NOTICE: Some characters are not supported by the CEA-608-E character encoding. These characters may be omitted or displayed as a different character.")
    # sets this flag to the user's submitted input

    #do_something = input("Type 'Omit' to delete all unsupported characters. Type anything else to allow unsupported characters to be converted to a supported CEA-608-E character. ")
    do_something="Omit"

    rollupcode0 = b"\x14\x27\x14\x2D\x14\x70"
    rollupcode1 = b"\x14\x27\x14\x2D\x13\x50"
    rollupcode2 = b"\x14\x2D\x13\x70"
    rollupcode3 = b"\x14\x2D\x14\x50"
    rollupcode4 = b"\x14\x2D\x14\x70"
    bypass = b"\x01\x30\x0D\x01\x30\x0D"
    fieldinsertmode = None
    resetcode = b"\x0F\x0F"
    newswire = None

    if (channel == 'Channel 1'):
        fieldinsertmode = b"\x01\x33\x0D\x01\x33\x0D"
        newswire = b"\x01\x4E\x36\x01\x4E\x36"
    elif (channel == 'Channel 2'):
        fieldinsertmode = b"\x01\x34\x0D\x01\x34\x0D"
        newswire = b"\x01\x50\x46\x01\x50\x46"
    else:
        print("Invalid channel specification. Exiting.") # in case of user typo regarding channel selection
        sys.exit(0)

    print(f"Connecting to {host} port {port}...")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # create socket
    s.connect((host, int(port))) # connect to link encoder using the specified credentials
    print("Connected\n")

    print("Start typing in captions. Press enter to send.")
    print("Press CTRL D if there are no more captions to send.")

    input_stream = io.TextIOWrapper(sys.stdin.buffer, encoding = 'iso-8859-1') # create a stdin stream using the iso-8859-1 (latin1) encoding

    character_diff_list = [] # create a list of all of the unsupported characters
    character_diff_list.append('*')
    character_diff_list.append('\\')
    character_diff_list.append("'")
    character_diff_list.append('_')
    character_diff_list.append('`')
    character_diff_list.append('{')
    character_diff_list.append('|')
    character_diff_list.append('}')
    character_diff_list.append('~')

    print("Note the following characters will be discarded " + ' '.join(character_diff_list))

    row_number_dict = {} # create dictionary of rollupcodes such that we can iterate through them
    row_number_dict[0] = rollupcode1 # top caption line
    row_number_dict[1] = rollupcode2 # second caption line
    row_number_dict[2] = rollupcode3 # third caption line
    row_number_dict[3] = rollupcode4 # bottom caption line
    row_number = 0 # keep track of which caption line we are on

    '''
    The bypass command is only sent for the captions on the 4th row, however if the captions are not long enough to reach the 4th row or
    the captions aren't long enough to reach the 4th row again then the bypass command isn't sent. Need to fix this.
    '''



    for line in input_stream: # reading from stdin
        sendNewsWire(s, newswire)
        if (do_something == "Omit"):
            for char_to_delete in character_diff_list:
                line = line.replace(char_to_delete, "") # replace all unsupported characters with the empty string

        list_of_words = line.split() # split the user submitted input on any kind of whitespace

        if (not list_of_words): # just in case there are no words to process for some reason (this shouldn't ever run)
            continue

        list_of_words_32 = [] # create list for storing 32 character string chunks

        # for every word, split the word into pieces if the word itself exceeds 32 characters, and add the words to the list
        for word in list_of_words:
            for word_32 in chunkstring(word, max_character_number):
                list_of_words_32.append(word_32)

        # keep sending words until all user input has been sent
        while (list_of_words_32):
            word = list_of_words_32.pop(0) # current word

            while (True):
                # if the current and next word combined (including the space between them) is 32 characters or less, combine them together to make a sentence
                if (list_of_words_32 and len(word) + 1 + len(list_of_words_32[0]) <= max_character_number):
                    next_word = list_of_words_32.pop(0)
                    word = word + ' ' + next_word
                else: # send the word(s)
                    #sendControlCodes(s, row_number_dict[row_number], fieldinsertmode)
                    newswire_word = bytes(word, "iso-8859-1") + b"\r"
                    sleep(0.1)
                    sendData(s, newswire_word)

                    break
        sleep(1)
        # Sending the bypass ensures the link encoder has an end time for the caption and does not hang onto the last line
        print("----")
        s.sendall(bypass)

    s.close()
    print("Closing program.")

if __name__== "__main__":
    main()
