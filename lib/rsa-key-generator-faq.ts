export const rsaKeyGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is an RSA key pair and when do I use it?",
    answer:
      "RSA is a public-key algorithm: you publish a public key for encryption or signature verification and keep the matching private key secret. Teams use RSA for TLS certificates, SSH host keys (often different PEM formats), JWT signing with some libraries, and encrypting small secrets with hybrid schemes. This tool outputs PKCS#8 private keys and SPKI public keys in PEM text, which many languages and OpenSSL can import.",
  },
  {
    question: "Which key size should I choose: 1024, 2048, 3072, or 4096 bits?",
    answer:
      "1024-bit RSA is obsolete for new production systems; browsers and auditors increasingly expect at least 2048 bits. Use 2048 for general compatibility, 3072 or 4096 when your policy or compliance framework requires longer moduli or you want extra margin—at the cost of slower generation and operations. For demos and local testing only, smaller sizes can be faster to generate.",
  },
  {
    question: "Are keys generated on your server?",
    answer:
      "No. Generation uses the Web Cryptography API (crypto.subtle) inside your browser tab. Nothing is uploaded unless you use another page that explicitly sends data over the network.",
  },
  {
    question: "Can I use these keys for HTTPS or production signing?",
    answer:
      "You can use the mathematical key material in workflows that accept PEM, but production TLS certificates are normally issued by a trusted CA with a CSR—not by pasting a raw key into a server. For signing, follow your library’s requirements (often RSA-PSS vs PKCS#1 v1.5). This page generates RSA-OAEP key pairs for encrypt/decrypt usage in Web Crypto; other tools may re-import the same PEM with different algorithm names.",
  },
  {
    question: "Why does the PEM say PUBLIC KEY and PRIVATE KEY?",
    answer:
      "Those labels wrap standard DER encodings: Subject Public Key Info (SPKI) for the public half and PKCS#8 for the private half. That is normal for interoperable PEM. Legacy OpenSSL files sometimes use BEGIN RSA PRIVATE KEY (PKCS#1); you can still paste those into this tool’s fields or upload them when viewing.",
  },
  {
    question: "How do I copy keys safely?",
    answer:
      "Use the copy buttons to move keys into a secure vault or configuration that is not committed to git. Avoid sharing private keys in chat or tickets. If a key is exposed, treat it as compromised and generate a new pair.",
  },
  {
    question: "What does the Upload button do?",
    answer:
      "It reads a local .pem or text file and fills the public and/or private text areas when it finds recognizable PEM blocks. Use it to inspect keys you already have or to move material between tools without retyping.",
  },
  {
    question: "Which other tools complement RSA key work?",
    answer:
      "Use the JWT encoder for signed token experiments, the bcrypt hash generator for password hashing (not RSA), the AES encrypt and decrypt tool for symmetric workflows, the hash generator for digests, and the SSL certificate checker when you need to inspect certificates from a live HTTPS URL—each linked from the Security and Encryption Tools section on the home page.",
  },
];
