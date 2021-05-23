import React from 'react';
import playingBoard from "../../img/playing-board.png"

class Instruction extends React.Component {

  render() {
    return (
      <div className="instruction">
        <h1>Principle and aim of the game</h1>
        <p>Brändi Dog is generally played by four people. Two people are in a team and play together. Similar to „Ludo“, 
          you must get your own marbles out of the home base and to the finish. It is much more exciting though as in this case
          not only luck but tactics and strategy also play an important part. During the game you are supported by your partner 
          and sent home by your opponents. The marbles are moved by playing the cards. It is not possible to win as an individual player. 
          As soon as one player has all their own marbles at the finish, they then help their partner to get their marbles to the finish. 
          The team has only won once the team’s eight marbles have all reached the finish.</p>
        
        <h1>The Playing Board</h1>
        <p><img src={playingBoard}/></p>
        
        <h1>Start</h1>
        <p>Two people sit diagonally opposite each other and play together as a team. Each player has their four marbles in the kennel. 
          Cards are handed out in an anti-clockwise direction.<br/>
          <br/>
          1st round: 6 cards <br/>
          2nd round: 5 cards <br/>
          3rd round: 4 cards <br/>
          4th round: 3 cards <br/>
          5th round: 2 cards<br/>
          <br/>
          It then starts again with 6 cards, 5, 4, 3, 2, 6, 5, 4 etc.<br/>
          <br/>
          The players pick up their cards. In each round, each of the partners exchange one card without revealing it. 
          You cannot look at the value of the card you receive from your partner until you have given one of your own cards to your partner. 
          The cards that have been exchanged are supposed to facilitate clever game moves. If your partner still has all of their marbles 
          in the kennel for example, you help them move to the start with a KING, ACE or JOKER.<br/>
          <br/>
          The starting player plays a card, then the next player etc. until the round has finished, which is as soon as all of the players 
          have put down and revealed all of their cards. If a player can’t make a move any more because a move isn’t possible with 
          their corresponding card values, then that player doesn’t take part in that round. Their cards are omitted and are placed in the middle.<br/>
          <br/>
          After each round, the start of the game moves from one person to the next in an anti-clockwise direction.
          </p>
        
        <h1>This is how you get to the start</h1>
        <p>You get one marble to the start with an ACE, a KING or a JOKER. Marbles which are played from the kennel at the start block access 
           for all marbles (even your own). This marble is also protected and cannot be sent home.</p>
        
        <h1>Send home when two marbles land on the same field</h1>
        <p>If two marbles, including two that belong to the same player, land on the same field, the one that was there first is sent back to the kennel. 
          If a marble lands on the starting field again on the way to the finish, it no longer blocks the entrance and can be swapped or sent home. 
          Marbles that are already at the finish cannot be sent back to the kennel.</p>
        
        <h1>Sending home when overtaken with the SEVEN</h1>
        <p>If a marble, including one that belongs to the same player, is overtaken by a „whole or split-up SEVEN“, then it is sent back to the kennel.</p>
        
        <h1>Overtaking</h1>
        <p>Marbles which are played out of the kennel at the start cannot be overtaken (blockade). Otherwise, overtaking is allowed.</p>
        
        <h1>Exchanging</h1>
        <p>With a JACK, your own marble must be exchanged with a marble belonging to your opponent or partner, even if this is a disadvantage.<br/>
          <br/>
          Marbles that land on a player‘s start for the first time, that are at the finish, or are still in the kennel, cannot be exchanged.<br/>
          <br/>
          If only your own marbles are in play and the player cannot make any other moves, then the JACK can be played at the end without effect.<br/>
        </p>

        <h1>Forcing someone to make a move</h1>
        <p>Every card must be played and the card value used up. Forcing a player to make a move means that in certain circumstances, 
          disadvantageous moves have to be made. If you need a FIVE to reach the finish for example, but your next card is a SIX, 
          this means that this marble has to do another round.</p>

        <h1>Approaching the finish</h1>
        <p>In order to end up at the finish, a player‘s start must have been touched at least twice, whether going backwards or forwards. 
          Leapfrogging and moving backwards to the finish are not allowed. It is filled from the inside to the outside. The card SEVEN is 
          particulary useful for reaching the finish because the SEVEN can be split into any individual values.<br/>
          <br/>
          The fastest move to the finish is:<br/>
          <br/>
          1st move: with an ACE, KING or JOKER to the start<br/>
          2nd move: go backwards with a FOUR<br/>
          3rd move: go to the finish with a FIVE, SIX, SEVEN or EIGHT
          </p>

        <h1>The strong team wins</h1>
        <p>If a player has all of his/her marbles in the finish, then he/she helps his/her partner. A SEVEN can be split in order 
          to get the last marbles belonging to a player into the finish. The remaining points that haven‘t been used up can then be used to 
          move a marble belonging to the partner. The player without marbles continues to be given cards, with the team playing together for victory. 
          Thinking ahead by both partners is particularly important in the end phase. In order to get the last marble of a game to the finish, 
          not all cards have to be used up. The value of the card most recently used must be used up, however. 
          That means that this marble may have to make several rounds until the number of points is used up.</p>

        <h1>Card values</h1>
        <p>
          <span>Joker</span> – Use however you wish<br/>
          <span>Ace</span> – Go to start, 1 forwards, 11 forwards<br/>
          <span>King</span> – Go to start, 13 forwards<br/>
          <span>Queen</span> – 12 forwards<br/>
          <span>Jack</span> – Exchange your marble with opponent's or partner's marble<br/>
          <span>Seven</span> – Split seven moves<br/>
          <span>Four</span> – 4 backwards, 4 forwards<br/>
          <span>All others</span> – The corresponding card amount forwards<br/>
        </p>
      </div>
    );
  }
}

export default Instruction;