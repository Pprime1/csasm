# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on two mobile devices, each connecting to the same data source to determine if they are within a proximity radius of either of the locations stored.
If they are within range the timestamp is updated for that location
It then checks if the timestamp of both locations is within 30 seconds of current time - ie: are both locations currently occupied?
If so, returns hidden text value. Otherwise restart the process (polling) to see if anything has changed.

Options to be included once base code is working
1. Allow a three-location ASM
2. Allow multiple different ASMs called by a 'GCCODE' as to which one is being attempted
