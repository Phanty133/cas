class Headline {
	headline: string = "";
	isTrue: boolean = false;
	explanation: string = "";
}

let currIndex = 0;
let headlines: Headline[] = [];
let incorrect: Headline[] = [];

// Fisher-Yates based mode doe
function shuffle(arr: any[]) {
	for (let i = 0; i < arr.length-1; i++) {
		let j = Math.floor(Math.random() * (arr.length - i - 1)) + i;
		let temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}

function init() {
	fetch("headlines.json").then(resp => resp.json()).then(resp => {
		headlines = resp; // load headlines
	});
}

function start() {
	currIndex = 0;
	incorrect = [];
	headlines = shuffle(headlines); // shuffle headlines
	// TODO: scene transition
}

function getNext() {
	return headlines[currIndex].headline;
}

function answer(answer: boolean) {
	if(headlines[currIndex].isTrue !== answer) {
		incorrect.push(headlines[currIndex]);
	}
	currIndex++;
}

function getMistakes() {
	let mistakeHTML = incorrect.map(x => {
		return `<b>${x.headline}</b> was ${x.isTrue ? "True" : "False"}\nYou answered: ${!x.isTrue ? "True" : "False"}\nReason:\n${x.explanation}`;
	});
	return mistakeHTML;
}

if (document.readyState === "complete" || document.readyState === "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}