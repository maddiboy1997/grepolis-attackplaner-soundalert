Datenschutzerklärung – Externe Audioabrufe

Stand: 17. November 2026

1. Vorgegebene Grepolis-Sounds

Das Script verwendet Audiodateien, die auf den CDN-Servern von InnoGames gehostet werden, um vorgegebene Benachrichtigungstöne abzuspielen.

Beim Abruf dieser Audiodateien können die Hosting-Server die IP-Adresse des Nutzers sowie technische Verbindungsinformationen erhalten. Das Script versucht, durch eine entsprechende Referrer-Einstellung die Übermittlung der aufgerufenen Grepolis-Seite zu verhindern.

2. Benutzerdefinierte Sound-URLs

Das Script ermöglicht es Nutzern, eigene Audio-URLs anzugeben.

Diese URLs können auf Server von Drittanbietern verweisen. Die Audiodateien werden direkt vom Browser des Nutzers abgerufen.

Beim Abruf einer benutzerdefinierten Audio-URL kann der jeweilige Server die IP-Adresse des Nutzers sowie technische Verbindungsinformationen erhalten.

Es werden sowohl HTTP- als auch HTTPS-URLs unterstützt.

- HTTPS: Die Verbindung ist verschlüsselt. Der Server, auf dem die Audiodatei gehostet wird, kann dennoch die IP-Adresse des Nutzers erhalten.
- HTTP: Die Verbindung ist nicht verschlüsselt. Dritte können möglicherweise die übertragenen Daten abfangen oder verändern.

Bevor eine benutzerdefinierte HTTP-Adresse übernommen wird, zeigt das Script eine Warnung an. Die URL wird erst nach ausdrücklicher Bestätigung durch den Nutzer übernommen.

Das Script versucht, durch eine entsprechende Referrer-Einstellung die Übermittlung der aufgerufenen Grepolis-Seite an den Audio-Host zu verhindern.

3. Dienste von Drittanbietern

Audiodateien, die von InnoGames oder von Nutzern angegebenen Drittanbietern gehostet werden, unterliegen den jeweiligen Datenschutzbestimmungen und Datenverarbeitungspraktiken dieser Anbieter.

Der Entwickler des Scripts hat keinen Einfluss darauf, wie diese externen Anbieter Verbindungsdaten verarbeiten.