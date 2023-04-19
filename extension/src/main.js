import * as configcat from "configcat-js-chromium-extension";

document.addEventListener('DOMContentLoaded', () => {
    
    let isVisualizerEnabled = false;
    
    const toggleBtn = document.getElementById('visualizer-btn');
    const popup = document.createElement('input');
    popup.type = 'color';

    const configCatClient = configcat.createClient("Your-SDK-key");
    
    function toggleCssVisualizer() {

        isVisualizerEnabled = !isVisualizerEnabled;

        const files = isVisualizerEnabled ? ['visualizer.css'] : [];

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.insertCSS({ target: { tabId: tabs[0].id }, files });
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (enable) => {
                    document.documentElement.classList.toggle('css-visualizer', enable);
                },
                args: [isVisualizerEnabled]
            });
        });
    }

    function toggleCssVisualizerWithCustomColor() {
        isVisualizerEnabled = !isVisualizerEnabled;
        const outline = isVisualizerEnabled ? `2px solid ${popup.value}` : 'none';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (enable, outline) => {
                    const elements = document.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.outline = outline;
                    }
                    document.documentElement.classList.toggle('css-visualizer', enable);
                },
                args: [isVisualizerEnabled, outline]
            });
        });
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.insertCSS({ target: { tabId: tabs[0].id }});
        });
    }

    configCatClient.getValueAsync("isColorPickerEnabled", false).then((value) => {
        if (value) {
            document.getElementById('popup').appendChild(popup);
            toggleBtn.addEventListener('click', toggleCssVisualizerWithCustomColor);
        } else {
            toggleBtn.addEventListener('click', toggleCssVisualizer);
        }
    });

});
