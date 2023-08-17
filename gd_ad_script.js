let sdkok = 0;

window["GD_OPTIONS"] = {
        "debug": true, // Enable debugging console. This will set a value in local storage as well, remove this value if you don't want debugging at all. You can also call it by running gdsdk.openConsole() within your browser console.
        "gameId": "59367e1da9d14a3a84892a9fa35843d4", // Your gameId which is unique for each one of your games; can be found at your Gamedistribution.com account.
        "onEvent": function(event) {
			
            switch (event.name) {
                case "SDK_GAME_START":
					// advertisement done, resume game logic and unmute audio
					console.log('script: SDK game start');
					if (c2_callFunction) c2_callFunction("adFinished");
                    break;
				case "SDK_GAME_PAUSE":
					console.log('script: SDK pause');
					// pause game logic / mute audio
                    break;
				case "SDK_READY":
						console.log('script 16: SDK ready');
						sdkok = 1;
						if (c2_callFunction) c2_callFunction("gd_loaded_ok");
                    break;
                case "SDK_ERROR":
					console.log('script: SDK error');
					sdkok = 0;
					//if (c2_callFunction) c2_callFunction("adError");
                    break;
				case "AD_ERROR":
					console.log('script: AD_ERROR');
					if (c2_callFunction) c2_callFunction("adError");
                    break;
				case "SDK_GDPR_TRACKING":
					// this event is triggered when your user doesn't want to be tracked
					break;
				case "SDK_GDPR_TARGETING":
					// this event is triggered when your user doesn't want personalised targeting of ads and such
					break;
				case "SDK_REWARDED_WATCH_COMPLETE":
					// this event is triggered when your user completely watched rewarded ad
					// Reward the player here. "giveReward"
					console.log('script: reward the player');
					if (c2_callFunction) c2_callFunction("rewardAdFinishedOk");
                break;
            }
        },
    };
	
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "patch/js/gd-main.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'gamedistribution-jssdk'));
	
	//document.getElementById('adbutton').addEventListener('click', function(){ gdsdk.showBanner(); });
	//document.getElementById('consolebutton').addEventListener('click', function(){ gdsdk.openConsole(); });
    
function showAd() {
		console.log('script: Begin of commercial break');
		if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined' && sdkok ==1) {
			gdsdk.showAd();
		} else {
			console.log('script: show ad error');
			if (c2_callFunction) c2_callFunction("adError");
		}
	}
	
function preloadRewardAd() {
		if (gdsdk !== 'undefined' && gdsdk.preloadAd !== 'undefined' && sdkok ==1) {
			gdsdk
				.preloadAd('rewarded')
				.then(response => {
				// A rewarded ad can be shown to user when he/she clicked it.
				console.log('script: reward ad preloaded OK -- ');
				if (c2_callFunction) c2_callFunction("rewardAdPreloadedOK");
			})
			.catch(error => {
				// Any Rewarded ad is not available to user. "rewardAdPreloadError"
				console.log('script: rewarded ad is not available, hide the reward button');
				if (c2_callFunction) c2_callFunction("rewardAdPreloadError");
			});
		}
	
	}
	
function showRewardAd() {
	// show reward ad
		if (gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
			console.log('script: try to show the reward ad');
			gdsdk.showAd('rewarded')
			.then(response => {
				// kompletiranost reward-a ne proveravam ovde, vec u event-ima gore
				console.log('script: reward ad ended, but, was it watched completely?');
			})
			.catch(error => {
				// An error catched. Please don't give reward here. "dontGiveReward"
				console.log('script: Reward ad error. Dont reward the player');
				if (c2_callFunction) c2_callFunction("rewardAdError");
			});
		} else {
			console.log('script: Reward ad error in the beginning. Dont reward the player.');
			if (c2_callFunction) c2_callFunction("rewardAdError");
		}
}