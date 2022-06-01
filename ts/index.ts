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
		document.getElementById("totalQuestions")!.innerText = headlines.length.toString();
	});

	addQuestionDropdown("q1", false, true, "hello1");
	addQuestionDropdown("q2", true, true, "hello2");
	addQuestionDropdown("q3", true, false, "hello3");
}

function start() {
	currIndex = 0;
	incorrect = [];
	headlines = shuffle(headlines); // shuffle headlines
	document.getElementById("frontpage")!.style.display = "none";
	document.getElementById("game")!.style.display = "block";
	getNext();
}

function getNext() {
	if (currIndex >= headlines.length) {
		// go to end
	} else {
		document.getElementById("curQuestion")!.innerText = (currIndex + 1).toString();
		document.getElementById("gameHeadline")!.innerText = headlines[currIndex].headline;
	}
}

function answer(answer: boolean) {
	if(headlines[currIndex].isTrue !== answer) {
		incorrect.push(headlines[currIndex]);
	}
	currIndex++;
	getNext();
}

function getMistakes() {
	let mistakeHTML = incorrect.map(x => {
		return `<b>${x.headline}</b> was ${x.isTrue ? "True" : "False"}\nYou answered: ${!x.isTrue ? "True" : "False"}\nReason:\n${x.explanation}`;
	});
	return mistakeHTML;
}

function addQuestionDropdown(q: string, isTrue: boolean, wasCorrect: boolean, explanation: string) {
	const container = document.getElementById("questionDropdownContainer") as HTMLDivElement;

	const correctPercentage = 69;

	const dropdownEl = document.createElement("div");
	dropdownEl.className = "questionDropdown";
	dropdownEl.setAttribute(wasCorrect ? "data-correct" : "data-wrong","");

	dropdownEl.innerHTML = `
	<span class="dropdownHeadline">${q}</span>
	<span class="dropdownHeadlineAnswer">${isTrue ? "Real" : "Fake"}</span>

	<div class="dropdownContent">
		<span>${explanation}</span>
		<br><br>
		<span class="questionDropdownCorrectPercentage"><b>${correctPercentage}%</b> answered correctly</span>
	</div>`;

	dropdownEl.addEventListener("click", () => { dropdownEl.toggleAttribute("data-active"); });

	container.appendChild(dropdownEl);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}
