class Headline {
	headline: string = "";
	isTrue: boolean = false;
	explanation: string = "";
}

let currIndex = 0;
let headlinesOg: Headline[] = [];
let headlines: Headline[] = [];
let incorrect: Headline[] = [];
let correct: boolean[] = [];

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
		headlinesOg = resp; // load headlines
		document.getElementById("totalQuestions")!.innerText = headlinesOg.length.toString();
		document.getElementById("totalQuestions2")!.innerText = headlinesOg.length.toString();
	});

	// addQuestionDropdown("q1", false, true, "hello1");
	// addQuestionDropdown("q2", true, true, "hello2");
	// addQuestionDropdown("q3", true, false, "hello3");
}

function start() {
	currIndex = 0;
	incorrect = [];
	correct = [];
	headlines = shuffle(headlinesOg); // shuffle headlines
	document.getElementById("frontpage")!.style.display = "none";
	document.getElementById("game")!.style.display = "block";
	getNext();
}

function getNext() {
	console.log(currIndex);
	console.log(headlinesOg.length);
	if (currIndex >= headlinesOg.length) {
		// getMistakes();
		document.getElementById("correctQuestionNr")!.innerText = (headlines.length - incorrect.length).toString();
		document.getElementById("game")!.style.display = "none";
		document.getElementById("end")!.style.display = "flex";
		fetch("https://cas-data-collector.herokuapp.com/endpoint", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: `{"correct":[${correct}]}`
		});
	} else {
		document.getElementById("curQuestion")!.innerText = (currIndex + 1).toString();
		document.getElementById("gameHeadline")!.innerText = headlines[currIndex].headline;
	}
}

function answer(answer: boolean) {
	if(headlines[currIndex].isTrue !== answer) {
		incorrect.push(headlines[currIndex]);
	}
	addQuestionDropdown(headlines[currIndex].headline, headlines[currIndex].isTrue, headlines[currIndex].isTrue === answer, headlines[currIndex].explanation);
	correct.push(headlines[currIndex].isTrue === answer);
	currIndex++;
	getNext();
}

function getMistakes() {
	// incorrect.map(x => {
	// 	addQuestionDropdown(x.headline, x.isTrue, !x.isTrue, x.explanation);
	// });
}

function addQuestionDropdown(q: string, isTrue: boolean, wasCorrect: boolean, explanation: string) {
	const container = document.getElementById("questionDropdownContainer") as HTMLDivElement;

	fetch("https://cas-data-collector.herokuapp.com/getStat?question=" + headlinesOg.map(x => x.headline).indexOf(q)).then(resp => resp.text()).then(resp => {
		const correctPercentage = Math.floor(parseFloat(resp) * 100);

		const dropdownEl = document.createElement("div");
		dropdownEl.className = "questionDropdown";
		dropdownEl.setAttribute(wasCorrect ? "data-correct" : "data-wrong", "");

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
	});
}

if (document.readyState === "complete" || document.readyState === "interactive") {
	init();
} else {
	window.addEventListener("DOMContentLoaded", init);
}
