var AUDIO = {
    
    interpolate: function( srcStart, srcEnd, targetStart, targetEnd, value ) {

        console.log( srcStart, srcEnd, targetStart, targetEnd, value );
        
        var norm = (value - srcStart) / (srcEnd - srcStart);
        return norm * (targetEnd - targetStart) + targetStart;

    },

    gainAt: function( note, time ) {
        
        var attackStart = 0,
            attackEnd = .05,
            decayEnd = .3,
            sustainEnd = .5,
            releaseEnd = 1,
            maxGain = 1,
            minGain = 0,
            sustainGain = .3;
        
        
        var t = ( time % note.period ) / note.period;
        var gain = 0;

        if ( t < attackEnd ) {
            
            var timeStart = attackStart,
                timeEnd = attackEnd,
                gainStart = minGain,
                gainEnd = maxGain;
            
            gain = AUDIO.interpolate( timeStart, timeEnd, gainStart, gainEnd, t );

        } else if (( t >= attackEnd ) && ( t < decayEnd )) {
            
            var timeStart = attackEnd,
                timeEnd = decayEnd,
                gainStart = maxGain,
                gainEnd = sustainGain;
            
            gain = AUDIO.interpolate( timeStart, timeEnd, gainStart, gainEnd, t );

        } else if (( t >= decayEnd ) && ( t < sustainEnd )) {

            var timeStart = decayEnd,
                timeEnd = sustainEnd,
                gainStart = sustainGain,
                gainEnd = sustainGain;
            
            gain = AUDIO.interpolate( timeStart, timeEnd, gainStart, gainEnd, t );

        } else if (( t >= sustainEnd ) && ( t < releaseEnd )) {

            var timeStart = sustainEnd,
                timeEnd = releaseEnd,
                gainStart = sustainGain,
                gainEnd = 0;
            
            gain = AUDIO.interpolate( timeStart, timeEnd, gainStart, gainEnd, t );
       
        } else { gain = 0; }
        
        return gain;

    },

    createPlayer: function( notes ) {
    
        var audio = new AudioContext(),
            notePlayers = notes.map( function(n) {
        
                var oscillator = AUDIO.createOscillator( n, audio ),
                    gain = AUDIO.createGainFor( oscillator, audio );
                return { oscillator: oscillator, gain: gain, note: n }

            });

        return function ( t ) {
            for( var i=0; i<notePlayers.length; i++ ) {        

                var player = notePlayers[i];
                player.note.gain = AUDIO.gainAt( player.note, t );
                player.gain.gain.value = player.note.gain;

            }
        }
        
    },
       
    createOscillator: function( note, audio ) {

        var oscillator = audio.createOscillator();
        oscillator.frequency.value = note.pitch;
        oscillator.start();
        return oscillator;

    },

    createGainFor: function( audioNode, audioContext ) {
        
        var gain = audioContext.createGain();
        gain.gain.value = 0;
        audioNode.connect( gain );
        gain.connect( audioContext.destination );
        return gain;

    }

}
