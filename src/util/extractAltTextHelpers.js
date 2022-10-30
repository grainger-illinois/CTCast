const JSZip = require('jszip');
const xml2js = require('xml2js');

var zip = JSZip();

export async function extractDocxImageAltText(myArrayBuffer) {
    await zip.loadAsync(myArrayBuffer);
    var promises = []

    const getAltTextFromZipEntry = async (zipEntry) => {

        const xmlRaw = await zipEntry.async('string');
        const xmlContent = await xml2js.parseStringPromise(xmlRaw);
            
        var images = []

        const findImages = (object) => {
            for (const [k,v] of Object.entries(object)) {

                if (k == 'w:drawing' && v[0]['wp:inline']) {
                    images.push(v[0]['wp:inline'][0]['wp:docPr'][0]['$']['descr']);
                    return;
                }
                if (typeof(v) === 'object') {
                    findImages(v);
                }
            };
        }
        
        findImages(xmlContent);
        return(images);
    }

    zip.forEach(async (_relativePath, zipEntry) => {
        if (zipEntry.name.match(/word\/document/)) {
            promises.push(getAltTextFromZipEntry(zipEntry));
        }
    });

    return await Promise.all(promises).then((values) => values);

}

export async function extractPptxImageAltText(myArrayBuffer) {
    await zip.loadAsync(myArrayBuffer);
    var promises = []

    const getAltTextFromZipEntry = async (zipEntry) => {

        const xmlRaw = await zipEntry.async('string');
        const xmlContent = await xml2js.parseStringPromise(xmlRaw);
        
        var images = []

        const findImages = (object) => {
            for (const [k,v] of Object.entries(object)) {
                if (k == 'p:pic') {
                    images.push(v[0]['p:nvPicPr'][0]['p:cNvPr'][0]['$']['descr']);
                    return;
                }
                if (typeof(v) === 'object') {
                    findImages(v);
                }
            };
        }
        findImages(xmlContent);
        return(images);
    }

    zip.forEach(async (_relativePath, zipEntry) => {
        if (zipEntry.name.match(/ppt\/slides\/slide[0-9].xml$/)) {
            promises.push(getAltTextFromZipEntry(zipEntry));
        }
    });

    return await Promise.all(promises).then((values) => values);

}