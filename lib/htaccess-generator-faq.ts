export const htaccessGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is an .htaccess file and when do I need it?",
      answer:
        "An .htaccess file is a per-directory configuration file used by Apache HTTP Server. It can enable redirects, HTTPS, caching, access control, and custom headers without editing the main server config. You need it when you host on shared hosting or want portable rules checked into your repository. It only applies if Apache is your web server and AllowOverride permits these directives.",
    },
    {
      question: "Does this tool upload my site or .htaccess to your servers?",
      answer:
        "No. Options are merged into a preview in your browser. Copy and download use local APIs only. If you use Upload, the file is read with the File API in your tab—nothing is sent to us for processing.",
    },
    {
      question: "Will this work on Nginx or IIS?",
      answer:
        "No. .htaccess is Apache-specific. Nginx uses server blocks and IIS uses web.config. If you migrate, translate the intent (redirects, TLS, caching) into the correct syntax for that server.",
    },
    {
      question: "Why force HTTPS before canonical www or non-www rules?",
      answer:
        "Redirects are easier to reason about when you first normalize the scheme (HTTP to HTTPS), then the hostname. The generator follows that order. Test with your real domain and a redirect checker after deploy.",
    },
    {
      question: "Hotlink protection blocked my own images—what happened?",
      answer:
        "Hotlink rules compare the Referer header to your primary hostname. If you load assets from a different domain or CDN, add that hostname to your server config manually or adjust the rule. Empty referrers are often allowed for direct navigation; some browsers omit referrers for privacy.",
    },
    {
      question: "How do I fix a 500 error after pasting generated rules?",
      answer:
        "A 500 usually means a syntax error or a directive your host disallows. Comment out sections to isolate the problem, confirm mod_rewrite and other modules are enabled, and check that Options +FollowSymLinks is permitted. Shared hosts sometimes restrict Header, Expires, or RewriteBase.",
    },
    {
      question: "Can I combine this with WordPress or Laravel?",
      answer:
        "Yes, but merge carefully: frameworks often ship their own .htaccess (for example WordPress front-controller rules). Place framework-required rules first unless documentation says otherwise, then add redirects and security headers. Always back up before editing production.",
    },
    {
      question: "What tools pair well with testing redirects and headers?",
      answer:
        "After deployment, use this site’s redirect chain checker and HTTP header checker on your URLs to confirm status codes and response headers. For PEM certificates and TLS inspection, the SSL certificate checker and SSL certificate decoder help validate what visitors receive.",
    },
  ];
