var VISUALS = {

    margin: .5,

    outerRadius: function( canvas ) { return Math.min( canvas.width, canvas.height ) / 2; },
    
    calculateNoteRadius: function( outerRadius, noteCount ) { 
        
        var outerRadiusMinusMargins = outerRadius - ( ( noteCount - 1 ) * VISUALS.margin );
        var noteDiameter = outerRadiusMinusMargins / noteCount;
        return noteDiameter / 2;

    },

    drawNotesAtTime: function( canvas, notes, time ) {

        var graphics = canvas.getContext('2d');

        var outerRadius = VISUALS.outerRadius( canvas );
        var originY = canvas.height / 2,
            originX = canvas.width / 2;

        var radius = VISUALS.calculateNoteRadius( outerRadius, notes.length );
        var note, angle, i, x, y, offset = radius;

        for ( i=0; i < notes.length; i++ ) {
            
            note = notes[i];
            angle = ( ( time % note.period ) / note.period ) * ( 2 * Math.PI );
            y = Math.sin(angle) * offset + originY;
            x = Math.cos(angle) * offset + originX;

            VISUALS.drawOrbit( originX, originY, offset, note.color, graphics );
            VISUALS.drawCircle( x, y, radius, note.color, graphics );
            VISUALS.drawCircle( x, y, radius, 'rgba(255,255,255,' + note.gain + ')', graphics );

            offset += ( 2 * radius + VISUALS.margin );

        }

    },

    drawCircle: function ( centerX, centerY, radius, color, graphics ) {
        
        graphics.beginPath();
        graphics.arc( centerX, centerY, radius, 0, 2 * Math.PI, false );
        graphics.fillStyle = color;
        graphics.fill();

    },

    drawOrbit: function ( centerX, centerY, radius, color, graphics ) {
        
        var oldAlpha = graphics.globalAlpha;
        graphics.globalAlpha = .5;
        graphics.beginPath();
        graphics.arc( centerX, centerY, radius, 0, 2 * Math.PI, false );
        graphics.strokeStyle = color;
        graphics.stroke();
        graphics.globalAlpha = oldAlpha;

    },

}
