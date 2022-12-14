const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;

async function init() {
	let currentGuess = "";
	let currentRow = 0;
	const ROUNDS = 6;

	const res = await fetch("https://words.dev-apis.com/word-of-the-day");
	const resObjt = await res.json();
	const word = resObjt.word.toUpperCase();
	console.log(word);
	const wordParts = word.split("");
	let done = false;
	console.log(wordParts);
	setLoading(false);

	function addLetter(letter) {
		if (currentGuess.length < ANSWER_LENGTH) {
			// Add letter to the end
			currentGuess += letter;
			// replace the last letter
		} else {
			currentGuess =
				currentGuess.substring(0, currentGuess.length - 1) + letter;
		}
		letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
			letter;
	}

	async function commit() {
		if (currentGuess.length !== ANSWER_LENGTH) {
			// do nothing
			return;
		}

		if (currentGuess === word) {
			// win
			alert("you win!");
			done = true;
			return;
		}
		// TODO: validate the word

		// TODO: do all the marking as "correct" "close" or "wrong"
		currentRow++;
		currentGuess = "";
		if (currentRow === ROUNDS) {
			alert(`you lose, the word was ${word}`);
			done = true;
		}

		const guestParts = currentGuess.split("");
		const map = makeMap(wordParts);

		for (let i = 0; i < ANSWER_LENGTH; i++) {
			if (guestParts[i] === wordParts[i]) {
				letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
				map[guestParts[i]]--;
			}
		}

		for (let i = 0; i < ANSWER_LENGTH; i++) {
			if (guestParts[i] === wordParts[i]) {
				// do nothing, already didn it
			} else if (
				wordParts.includes(guestParts[i]) &&
				map[guestParts[i] > 0] /* TODO make this more accurate */
			) {
				letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
				map[guestParts[i]]--;
			} else {
				letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
			}
		}

		// TODO: did they win or lose ?
		currentRow++;
		currentGuess = "";
	}

	function backspace() {
		currentGuess = currentGuess.substring(0, currentGuess.length - 1);
		letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
	}

	document.addEventListener("keydown", function handleKeyPress(event) {
		const action = event.key;
		console.log(action);

		if (action === "Enter") {
			commit();
		} else if (action === "Backspace") {
			backspace();
		} else if (isLetter(action)) {
			addLetter(action.toUpperCase());
		} else {
			// do nothing
		}
	});
}

function isLetter(letter) {
	return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
	loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
	const obj = {};
	for (let i = 0; i < array.length; i++) {
		const letter = array[i];
		if (obj[letter]) {
			obj[letter]++;
		} else {
			obj[letter] = 1;
		}
	}
	return obj;
}

init();
