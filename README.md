# TODO
update package.json
- remove unfinished games instance
- refactor more
- check code coverage
- unittest for server
- update this readme
- test node 4, 5 and 6
- docker


# Requirements

Build a simple HANGMAN game that works as follows:
- chooses a random word out of 6 words: (3dhubs, marvin, print, filament, order, layer)
- prints the spaces for the letters of the word (eg: ​_ _ _​ _ _ for order)
- the user can try to ask for a letter and that should be shown on the puzzle (eg: asks for "r" and now it shows ​_ r _​ _ r for order)
- the user can only ask 5 letters that don't exist in the word and then it's game over
- if the user wins, congratulate him!
