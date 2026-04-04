export const sitemapGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is an XML sitemap?",
      answer:
        "An XML sitemap is a file that lists important URLs on your site so search engines can discover and crawl them efficiently. It uses the sitemaps.org format (urlset with loc entries). It does not guarantee indexing, but it signals canonical URLs and optional metadata like last modified date.",
    },
    {
      question: "How do I submit a sitemap to Google Search Console?",
      answer:
        "Host the XML file on your site (for example at https://yoursite.com/sitemap.xml), verify the property in Google Search Console, then open Sitemaps and enter the path (/sitemap.xml). Google will fetch it periodically. You can also reference the sitemap URL in robots.txt with a Sitemap: line using a robots.txt generator.",
    },
    {
      question: "What is the maximum number of URLs in one sitemap file?",
      answer:
        "The sitemaps protocol allows up to 50,000 URLs per file and the uncompressed file must stay under 50 MB. Larger sites split into multiple sitemap files and use a sitemap index file that lists them. This tool focuses on a single urlset for typical small and medium lists.",
    },
    {
      question: "Should I include lastmod, changefreq, and priority?",
      answer:
        "loc is required; lastmod, changefreq, and priority are optional. Google has indicated it uses lastmod when it is accurate and consistent. Use real update dates when you can. changefreq and priority are hints—many sites omit them or set them conservatively to avoid misleading crawlers.",
    },
    {
      question: "Can I use relative URLs in this generator?",
      answer:
        "Enter a site origin (scheme plus host, such as https://example.com) and then list paths starting with /. The tool resolves each path to an absolute URL. You can also paste only full http or https URLs and leave the origin empty.",
    },
    {
      question: "Does this tool upload my URLs to your servers?",
      answer:
        "No. Parsing and XML generation run entirely in your browser. Upload only reads a local text file you choose to fill the URL list—nothing is sent to us. Avoid pasting private or authenticated URLs in shared environments.",
    },
    {
      question: "How does this relate to robots.txt?",
      answer:
        "robots.txt tells crawlers what they may fetch; a sitemap lists URLs you care about for discovery. Best practice is to allow crawling of important pages in robots.txt and point to your sitemap with a Sitemap directive. Use our robots.txt generator to build that file and keep rules aligned.",
    },
    {
      question: "What about hreflang and multilingual sites?",
      answer:
        "Standard XML sitemaps list URLs per locale or you can use hreflang annotations in pages. For tag clusters across languages, many teams maintain separate sitemap entries per URL and use the hreflang tag generator to keep language-region pairs consistent.",
    },
  ];
