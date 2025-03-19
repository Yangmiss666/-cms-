// 存储当前语言
let currentLanguage = 'en';

// 加载语言文件
function loadLanguage(language) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `locales/${language}.json`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Failed to load language file: ${xhr.statusText}`));
                }
            }
        };
        xhr.send();
    });
}

// 替换占位符
function replacePlaceholders(translations) {
    const elements = document.querySelectorAll('*');
    elements.forEach((element) => {
        element.childNodes.forEach((node) => {
            if (node.nodeType === 3) {
                const text = node.textContent;
                const newText = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
                    return translations[key] || match;
                });
                if (newText !== text) {
                    node.textContent = newText;
                }
            }
        });
    });
}

// 切换语言
async function changeLanguage(language) {
    currentLanguage = language;
    try {
        const translations = await loadLanguage(language);
        replacePlaceholders(translations);
    } catch (error) {
        console.error(error);
    }
}

// 初始化语言
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const translations = await loadLanguage(currentLanguage);
        replacePlaceholders(translations);
    } catch (error) {
        console.error(error);
    }
});

// 暴露 changeLanguage 函数供外部调用
window.changeLanguage = changeLanguage;