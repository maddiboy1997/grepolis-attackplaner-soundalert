Privacy Policy – External Audio Requests

Last updated: 17 November 2026

1. Predefined Grepolis Sounds

The script uses audio files hosted on InnoGames CDN servers to play predefined notification sounds.

When these audio files are requested, the hosting servers may receive the user's IP address and technical connection information. The script applies a "no-referrer" policy to audio requests to prevent the transmission of the referring page's URL.

2. Custom Sound URLs

The script allows users to specify their own audio URLs.

These URLs may point to servers operated by third parties and are requested directly by the user's browser.

When a custom audio URL is requested, the respective server can receive the user's IP address and technical connection information.

Both HTTP and HTTPS URLs are supported.

- HTTPS: The connection is encrypted. However, the server hosting the audio file can still receive the user's IP address.
- HTTP: The connection is not encrypted. Other parties may be able to intercept or modify the transmitted data.

Before a custom HTTP URL is applied, the script displays a warning. The URL is only accepted after the user explicitly confirms this warning.

The script uses a "no-referrer" policy for audio requests. Therefore, the referring page's URL should not be transmitted to the audio host.

3. Third-Party Services

Audio files hosted by InnoGames and any third-party servers specified by users are subject to the respective providers' privacy policies and data-processing practices.

The script developer has no control over how these external providers process connection data.