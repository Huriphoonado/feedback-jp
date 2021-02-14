let audioStarted = false;

document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start();
	audioStarted = true;
});
