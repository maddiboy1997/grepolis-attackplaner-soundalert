
// ==UserScript==
// @name         Grepolis Attack Planner Sound Alert
// @namespace    https://grepolis.com/
// @version      1.3.1
// @description  Custom sound alerts for planned attacks
// @author       Dominique
// @updateURL
// @downloadURL
// @match        https://*.grepolis.com/game/*
// @icon         https://www.grepolis.com/favicon.ico
// @homepageURL  https://grepolis.com/
// @run-at       document-start
// @sandbox      raw
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const NOTIFY_ENDPOINT = '/game/notify';
    const NOTIFICATION_TYPE = 'planed_attack';

    const SOUND_VOLUME = 0.7;

    const STORAGE_SOUND = 'gp_attack_sound_selection';
    const STORAGE_CUSTOM_URL = 'gp_attack_sound_custom_url';

    const SOUNDS = {
        sound1: 'https://gpde.innogamescdn.com/audio/effects/000001_Angriff_Version_01.ogg',
        sound2: 'https://gpzz.innogamescdn.com/audio/click/005009_Gold_kaufen_Version_01.ogg',
        sound3: 'https://gpzz.innogamescdn.com/audio/effects/003010_Premium_Version_02.ogg'
    };

    // --------------------------------------------------
    // Settings
    // --------------------------------------------------

    let selectedSound = localStorage.getItem(STORAGE_SOUND) || 'sound1';
    let customSoundURL = localStorage.getItem(STORAGE_CUSTOM_URL) || '';

    if (!['sound1', 'sound2', 'sound3', 'custom'].includes(selectedSound)) {
        selectedSound = 'sound1';
    }

    let audioUnlocked = false;
    let initialized = false;

    const seenNotifications = new Set();

    // --------------------------------------------------
    // Audio
    // --------------------------------------------------

    const alertSound = new Audio();

    alertSound.preload = 'auto';
    alertSound.volume = SOUND_VOLUME;

    function getSoundURL() {
        return selectedSound === 'custom'
            ? customSoundURL.trim()
            : SOUNDS[selectedSound];
    }

    function updateSound() {
        const url = getSoundURL();

        if (!url) {
            alertSound.pause();
            alertSound.removeAttribute('src');
            alertSound.load();
            return;
        }

        if (alertSound.src !== new URL(url, location.href).href) {
            alertSound.src = url;
            alertSound.load();
        }

        console.log('[Grepolis Sound] Selected:', selectedSound);
    }

    updateSound();

    function playSound() {
        if (!audioUnlocked || !getSoundURL()) return;

        alertSound.currentTime = 0;

        alertSound.play().catch(error => {
            console.warn('[Grepolis Sound] Playback failed:', error);
        });
    }

    // --------------------------------------------------
    // Automatic audio activation
    // --------------------------------------------------

    function unlockAudio() {
        if (audioUnlocked) return;

        const url = getSoundURL();
        if (!url) return;

        alertSound.muted = true;

        alertSound.play().then(() => {
            alertSound.pause();
            alertSound.currentTime = 0;
            alertSound.muted = false;

            audioUnlocked = true;

            console.log('[Grepolis Sound] Audio unlocked.');
        }).catch(() => {
            alertSound.muted = false;
        });
    }

    document.addEventListener('click', unlockAudio, true);
    document.addEventListener('keydown', unlockAudio, true);

    // --------------------------------------------------
    // Sound selection UI
    // --------------------------------------------------

    function createSoundSettings() {
        const windowElement = document.getElementById('gpwnd_1000');
        if (!windowElement) return;

        // Search for the attack planner button bar.
        const buttonsBar =
            windowElement.querySelector('.plan_details_screen .buttons_bar') ||
            windowElement.querySelector('.game_inner_box.attack_planner .buttons_bar') ||
            windowElement.querySelector('.buttons_bar');

        if (!buttonsBar) return;

        let container = document.getElementById('gp-attack-sound-settings');

        if (container && container.parentElement === buttonsBar) return;

        if (!container) {
            container = document.createElement('div');
            container.id = 'gp-attack-sound-settings';

            Object.assign(container.style, {
                display: 'inline-flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '6px',
                marginLeft: '12px',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#ffcc66',
                verticalAlign: 'middle',
                position: 'relative',
                zIndex: '10'
            });

            const label = document.createElement('label');
            label.textContent = 'Sound:';
            label.htmlFor = 'gp-attack-sound-select';

            const select = document.createElement('select');
            select.id = 'gp-attack-sound-select';

            [
                { value: 'sound1', text: 'Sound 1' },
                { value: 'sound2', text: 'Sound 2' },
                { value: 'sound3', text: 'Sound 3' },
                { value: 'custom', text: 'Eigener Sound' }
            ].forEach(option => {
                const element = document.createElement('option');
                element.value = option.value;
                element.textContent = option.text;
                select.appendChild(element);
            });

            select.value = selectedSound;

            Object.assign(select.style, {
                padding: '3px 5px',
                maxWidth: '125px',
                cursor: 'pointer'
            });

            const customInput = document.createElement('input');
            customInput.type = 'url';
            customInput.id = 'gp-attack-sound-custom-url';
            customInput.placeholder = 'Sound-URL';
            customInput.value = customSoundURL;

            Object.assign(customInput.style, {
                width: '220px',
                maxWidth: '25vw',
                padding: '3px 5px',
                display: selectedSound === 'custom' ? '' : 'none'
            });

            select.addEventListener('change', () => {
                selectedSound = select.value;

                localStorage.setItem(STORAGE_SOUND, selectedSound);

                customInput.style.display =
                    selectedSound === 'custom' ? '' : 'none';

                updateSound();
            });

            customInput.addEventListener('change', () => {
                customSoundURL = customInput.value.trim();

                localStorage.setItem(
                    STORAGE_CUSTOM_URL,
                    customSoundURL
                );

                if (selectedSound === 'custom') {
                    updateSound();
                }
            });

            container.appendChild(label);
            container.appendChild(select);
            container.appendChild(customInput);
        }

        buttonsBar.appendChild(container);

        console.log('[Grepolis Sound] Settings attached to:', buttonsBar);
    }

    // --------------------------------------------------
    // Observe Grepolis UI
    // --------------------------------------------------

    const uiObserver = new MutationObserver(() => {
        createSoundSettings();
    });

    function startUIObserver() {
        if (!document.documentElement) {
            requestAnimationFrame(startUIObserver);
            return;
        }

        uiObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        createSoundSettings();
    }

    startUIObserver();

    // --------------------------------------------------
    // Notification processing
    // --------------------------------------------------

    function processResponse(response) {
        if (!response || !response.json) return;

        const notifications = response.json.notifications;

        if (!Array.isArray(notifications)) return;

        // Ignore existing notifications on initial load.
        if (!initialized) {
            notifications.forEach(notification => {
                if (notification.id !== undefined) {
                    seenNotifications.add(notification.id);
                }
            });

            initialized = true;

            console.log('[Grepolis Sound] Initialized.');
            return;
        }

        notifications.forEach(notification => {
            if (notification.type !== NOTIFICATION_TYPE) return;
            if (seenNotifications.has(notification.id)) return;

            seenNotifications.add(notification.id);

            console.log(
                '[Grepolis Sound] Planned attack detected:',
                notification.subject
            );

            playSound();
        });
    }

    // --------------------------------------------------
    // Request URL detection
    // --------------------------------------------------

    function isNotifyRequest(url) {
        try {
            const parsed = new URL(url, location.href);

            return (
                parsed.pathname === NOTIFY_ENDPOINT &&
                parsed.searchParams.get('action') === 'fetch'
            );
        } catch (error) {
            return false;
        }
    }

    // --------------------------------------------------
    // XMLHttpRequest interception
    // --------------------------------------------------

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._grepolisNotifyRequest = isNotifyRequest(url);

        return originalOpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        if (this._grepolisNotifyRequest) {
            this.addEventListener('load', function () {
                try {
                    processResponse(JSON.parse(this.responseText));
                } catch (error) {
                    console.warn(
                        '[Grepolis Sound] Could not parse response:',
                        error
                    );
                }
            });
        }

        return originalSend.apply(this, args);
    };

    // --------------------------------------------------
    // Fetch interception
    // --------------------------------------------------

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        const requestUrl = args[0] instanceof Request
            ? args[0].url
            : args[0];

        if (isNotifyRequest(requestUrl)) {
            response.clone().json()
                .then(processResponse)
                .catch(error => {
                    console.warn(
                        '[Grepolis Sound] Fetch response error:',
                        error
                    );
                });
        }

        return response;
    };

    console.log('[Grepolis Sound] Userscript loaded.');

})();
