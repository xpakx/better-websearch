let items = [];
let active = null;
let gPressed = false;
let searchbox = null;
let inputMode = false;

document.addEventListener("DOMContentLoaded", () => {
    items = document.querySelectorAll(".snippet");
    searchbox = document.querySelector("#searchbox");

    fetch(chrome.runtime.getURL("styles/style.css"))
        .then(response => response.text())
        .then(css => {
            var style = document.createElement("style");
            style.innerHTML = css;
            document.head.insertAdjacentElement('beforeend', style);
        });

    searchbox.addEventListener("focus", function () {
        inputMode = true;
    });

    searchbox.addEventListener("blur", function () {
        inputMode = false;
    });
});


function next() {
    selectItem(active != null ? active + 1 : 0);
}

function prev() {
    selectItem(active != null ? active - 1 : 0);
}


function selectItem(next) {
    if (next < 0 || next >= items.length) {
        return;
    }
    if (active != null) {
        const prevItem = items[active];
        prevItem.classList.remove('selected-brave');
    }

    active = next;
    const item = items[active];
    item.classList.add('selected-brave');
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deSelect() {
    const item = items[active];
    item.classList.remove('selected-brave');
    active = null;
}

function goToLink(newTab = false) {
    const link = items[active].querySelector(".result-header");
    if (!link) {
        return;
    }
    const href = link.getAttribute('href');
    if (newTab) {
        window.open(href, '_blank');
    } else {
        window.location.href = href;
    }
}


document.addEventListener('keydown', function (event) {
    if(inputMode) {
        if (event.key === 'Escape') {
            searchbox.blur();
        }
        return;
    }
    if (event.key === 'j') {
        prev();
    } else if (event.key === 'k') {
        next();
    } else if (event.key === ' ' && active != null) {
        event.preventDefault();
        goToLink(event.altKey);
    } else if (event.key === 'Escape' && active != null) {
        deSelect();
    } else if (event.key === 'g' && gPressed) {
        selectItem(0);
    } else if (event.key === 'g' && !gPressed) {
        gPressed = true;
    } else if (event.key === 'G') {
        selectItem(items.length - 1);
    }

    if (gPressed && event.key !== 'g') {
        gPressed = false;
    }
});

/*
 TODO
 .rh-definitions
 .news-carousel
 .video-carousel
 .search-elsewhere
*/