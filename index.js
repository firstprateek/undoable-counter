let counter = JSON.parse(localStorage.getItem('counter')) || 0;
let history = JSON.parse(localStorage.getItem('history')) || [];
let idx = history.length;
const MAX_HISTORY_LENGTH = 50;
    history.unshift();

const $undo = document.querySelector('.undo');
const $redo = document.querySelector('.redo');
$redo.disabled = true;

const counterActions = document.querySelector('.counters').children;

const $minus100 = counterActions[0];
const $minus10 = counterActions[1];
const $minus1 = counterActions[2];

const $counterDisplay = counterActions[3];

const $plus1 = counterActions[4];
const $plus10 = counterActions[5];
const $plus100 = counterActions[6];

const $historyList = document.querySelector('.history-list');

const $clear = document.querySelector('.clear');

let tracker = 0;
for (let i = 0; i < history.length; i++) {
    let value = history[i];
    const $historyItem = document.createElement('li');
    const text = `${value > 0 ? '+' : ''}${value}     (${tracker} -> ${tracker + value})`;
    const $preContent = document.createElement('pre');

    tracker += value;
    $preContent.textContent = text;
    $historyItem.appendChild($preContent);
    $historyList.appendChild($historyItem);
    $historyList.scrollTop = $historyList.scrollHeight;
}

$counterDisplay.textContent = tracker;

if (idx > 0) {
    $historyList.children[idx-1].classList.add('selected');
}

const changeCounter = (value) => {
    if (idx < history.length) {
        for (let i = history.length - 1; i >= idx; i--) {
            $historyList.removeChild($historyList.children[i]);
        }
        $redo.disabled = true;
    }

    history.splice(idx);

    const $historyItem = document.createElement('li');
    const text = `${value > 0 ? '+' : ''}${value}     (${counter} -> ${counter + value})`;
    const $preContent = document.createElement('pre');

    $preContent.textContent = text;
    $historyItem.appendChild($preContent);
    $historyItem.classList.add('selected');
    $historyList.appendChild($historyItem);
    $historyList.scrollTop = $historyList.scrollHeight;

    if ($historyList.children.length > 1) {
        $historyList.children[idx-1].classList.remove('selected');
    }

    counter += value;
    history.push(value);
    idx++;

    localStorage.setItem('counter', JSON.stringify(counter));
    localStorage.setItem('history', JSON.stringify(history));

    $counterDisplay.textContent = counter;

    if (history.length > MAX_HISTORY_LENGTH) {
        history.unshift();
        $historyList.removeChild($historyList.firstElementChild);
    }
}

const undoHistory = () => {
    if (idx === 0) {
        return;
    }

    $historyList.children[idx-1].classList.remove('selected');

    const olderValue = history[idx - 1];
    counter -= olderValue;
    idx--;

    if (idx >= 1) {
        $historyList.children[idx-1].classList.add('selected');
    }

    $counterDisplay.textContent = counter;
    $redo.disabled = false;

    if (idx === 0) {
        $undo.disabled = true;
    }
}

const redoHistory = () => {
    if (idx >= history.length) {
        return;
    }

    if (idx >= 1) {
        $historyList.children[idx - 1].classList.remove('selected');
    }

    const nextValue = history[idx];
    counter += nextValue;
    idx++;

    $historyList.children[idx - 1].classList.add('selected');

    $counterDisplay.textContent = counter;

    $undo.disabled = false;

    if (idx >= history.length) {
        $redo.disabled = true;
    }
}

$minus100.addEventListener('click', (e) => changeCounter(-100));
$minus10.addEventListener('click', (e) => changeCounter(-10));
$minus1.addEventListener('click', (e) => changeCounter(-1));
$plus1.addEventListener('click', (e) => changeCounter(+1));
$plus10.addEventListener('click', (e) => changeCounter(+10));
$plus100.addEventListener('click', (e) => changeCounter(+100));

$undo.addEventListener('click', (e) => undoHistory());
$redo.addEventListener('click', (e) => redoHistory());

$clear.addEventListener('click', (e) => {
    localStorage.clear();
    counter = 0;
    history = [];
    idx = 0;
    $historyList.replaceChildren();
    $counterDisplay.textContent = 0;
});