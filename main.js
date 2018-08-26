// voximplant-cloud-scenario-sum

VoxEngine.addEventListener(AppEvents.Started, e => {
  const numberToCall = "one-phone-number";
  const confirmedCallerId = "another-phone-number";
  //  const out = VoxEngine.callPSTN(numberToCall, confirmedCallerId);
  const out = VoxEngine.callUser(
    "testCase",
    "String-to-display-on-called-user-device-as-a-caller-name"
  );
  out.addEventListener(CallEvents.Connected, () => {
    out.say("Please enter 2 numbers on your phone", Language.US_ENGLISH_FEMALE);
    out.handleTones(true);
    new Promise(resolve => {
      out.addEventListener(CallEvents.ToneReceived, e => {
        resolve(e);
      });
    })
      .then(tone1 => {
        return new Promise(resolve => {
          out.addEventListener(CallEvents.ToneReceived, e => {
            resolve(e);
          });
        }).then(tone2 => ({ tone1, tone2 }));
      })
      .then(events => {
        const sum = Number(events.tone1.tone) + Number(events.tone2.tone);
        if (Number.isNaN(sum)) {
          out.say("Your input is not valid. Goodbye.");
        } else {
          out.say(`${String(sum)}. Goodbye.`);
        }
        out.addEventListener(CallEvents.PlaybackFinished, () => {
          VoxEngine.terminate();
        });
      });
  });
});
