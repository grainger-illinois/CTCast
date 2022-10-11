import React from 'react'


const Help = () => {
  return (
    <div style={{ margin: "20px", marginTop: "30px" }}>

      <h1>Captioned Enhanced Audio Descriptions Best Practices</h1>

      <h2>Speaker's Names</h2>
      <p>Speakers should be identified by typing their name to help label speaker the first time they speak. Help to include at least first time they are spoken, if two speakers have very similar voices. In normal dialog labeling every speaker change would be excessive. If the speakers are known in advance it can be helpful to pre-create shortcuts for their names, e.g.,a shortcut <tt>ChRoJo</tt> for <tt>Chancellor Robert Jones</tt>.</p>

      <h2>Numbers</h2>
      <p>Digits should not be separated with commas or spaces between thousands. e.g., <tt>90000</tt> is better than <tt>90,000.</tt>.</p>
      <p>Due to limited caption bandwidth and auditory processing it is often preferable to avoid unnecessary precision. e.g. <tt>Approx. 15000, 50000, and 90000</tt> is easier to process in spoken form than <tt>15395.25 51423.12 91912.23</tt></p>

      <h2>Be brief, succinct and accurate</h2>
      <p>Avoid preamble. For example <tt>A picture of the Union</tt> is better written as just<tt>The Union</tt></p>

      <h2>Split tables into multiple descriptions (overview, then cross-sections).</h2>
      <p>Multi row and column data can be described at different times.</p>
      <p>Start with an overview - the scope or intent of the data e.g., <tt>Increasing student enrollment at each campus over the last decade</tt> then describe a portion of the data horizontally or vertically depending on the discussion. For example, the discussion may focus on enrollment between campus's or focus on enrollment over time for a specific campus. In the former, briefly describe enrollment changes for each year for one specific campus.</p>

      <h2>Accurate pronunciation</h2>
      <p>Some words (e.g., Grainger) are mispronounced by automated Speech To Text conversions. Alternative incorrect spellings to improve the pronunciation can be included inside square brackets. For example, <tt>Grainger[Grain-jer] College of Engineering.</tt> The original, correct spelling should still be included for display and Braille rendering output</p>

      <h2>Shortcuts</h2>
      The format of a shortcuts may include a document prefix (e.g., <tt>/doc1-alt1</tt>) or not e.g. <tt>/ChRoJo</tt>. The document prefix is required when there are identical shortcuts in more than one document.

      Use the shortcuts tab to upload documents and to create your own shortcuts.
    </div>
  );
}

export default Help;
