const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const DOCU_URL = 'https://chemotion.net';

// Fetch content from a URL
const fetchContent = async (url) => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (error) {
        console.error('Error fetching the URL:', error);
        return null;
    }
};

// Convert HTML to Markdown
const exportLinks = (html) => {
    const $ = cheerio.load(html);
    const result = []
    $('a').each((index, element) => {
        let linkHref = $(element).attr('href');
        if (linkHref && linkHref.startsWith('/docs')) {
            linkHref = linkHref.split('#')[0];
            result.push(linkHref);
        }
    });

    return result
};

// Main function to run the script
const exportToMarkdown = async (url = [], idx = 0) => {
    if(url.length === 0) {
        url.push('/docs')
    }
    const html = await fetchContent(DOCU_URL + url[idx]);
    if (html) {
        url = url.concat(exportLinks(html));
        url = url.filter((url_path, pos)=> {
            return url.indexOf(url_path) === pos;
        });
    }
    idx++;
    if(idx < url.length) {
        return exportToMarkdown(url, idx)
    }

    return url.map((x) => DOCU_URL + x)

};

// Example usage
const url = 'https://example.com'; // Replace with the URL of the page you want to export
const outputPath = path.join(__dirname, 'output.md'); // Specify the output file path

exportToMarkdown().then((res) => {
    console.log(res.join('\n'))
});
