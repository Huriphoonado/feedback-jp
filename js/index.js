// TODOS
// Names
// 	Audio On -> Start
// 	Global Volume -> Nix
// 	Oscillator -> Nix
// 		No Header, Volume -> Interference
// 		Pitch -> Buttons, "Pitch 1, 2..."
//  Filter/Limiter -> Eventually gone,

let appIsOn = false;
let micOpened = false;

// ----------- Instruments -----------

// Sine Wave Oscillator
const cycle = new Tone.Oscillator(243, "sine");
const cycleVol = new Tone.Volume(-76);

// Microphone Input
const mic = new Tone.UserMedia();
const inputMeter = new Tone.Meter();

// Output Chain
const biquadFilt = new Tone.BiquadFilter({
	frequency: 300,
	Q: 1.75,
	type: 'lowpass'
});
const outputVol = new Tone.Volume(-5);
const limiter = new Tone.Limiter(-20);

const waveform = new Tone.Waveform();

// Connect the Chains
cycle.chain(cycleVol, outputVol);
mic.fan(inputMeter, biquadFilt);
biquadFilt.connect(outputVol);
outputVol.chain(limiter, Tone.Destination);


// ----------- Interface -----------

// Turn audio and everything on
/*document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start();

	mic.open().then(() => {
		console.log("mic open");
		setInterval(() => console.log(inputMeter.getValue()), 100);
	}).catch(e => console.log("mic not open"));

});*/

async function toggleOn() {
	let onButton = document.getElementById('onButton');
	console.log(onButton);
	console.log(onButton.classList);
	// Turn on the audio context
	if (Tone.context.state !== 'running') {
		await Tone.start();
	}

	// Attempt to access the user's microphone
	if (!micOpened) {
		mic.open().then(() => {
			console.log("mic open");
			micOpened = true;
			//setInterval(() => console.log(inputMeter.getValue()), 100);
		}).catch(e => console.log("mic not open"));
	}

	if (!appIsOn) {
		set_globalVol(0);
		cycle.start();
		onButton.classList.add('button-clicked');
		appIsOn = true;
	}

	else {
		set_globalVol(-76);
		cycle.stop();
		onButton.classList.remove('button-clicked');
		appIsOn = false;
	}
}

// Global Volume
function set_globalVol(val) { outputVol.volume.rampTo(val, 0.1); }

// Oscillator (Cyle)
function set_cycleVol(val) { cycleVol.volume.rampTo(val, 0.1); }

function set_cycleFreq(val) {
	console.log(val);
	let freqs = [243, 261, 293, 323];
	let uiText = document.getElementById('cycleFreqText');
	cycle.frequency.rampTo(freqs[val], 0.1);
	uiText.innerHTML = freqs[val];
}

// Biquad
function set_filtFreq(val) {
	let uiText = document.getElementById('filtFreqText');
	biquadFilt.frequency.rampTo(val, 0.1);
	uiText.innerHTML = val;
}

function set_filtQ(val) {
	let uiText = document.getElementById('filtQText');
	biquadFilt.Q.value = val;
	uiText.innerHTML = val;
}

// Limiter
function set_limiter(val) {
	let uiText = document.getElementById('limiterThreshText');
	limiter.threshold.rampTo(val, 0.1);
	uiText.innerHTML = val;
}
