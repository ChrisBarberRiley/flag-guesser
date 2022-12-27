import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentCountry, setCurrentCountry] = useState('');
  const [questionOptions, setQuestionOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const answerLength = 6;
  const [correctAnswer, setCorrectAnswer] = useState(false);

  const getCountries = () => {
    fetch('assets/world.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        const rand = getRandomCountry(myJson);
        console.log(rand);
        setCurrentCountry(myJson[rand]);
        console.log('Current Country: ', currentCountry);
        const options = [];
        options.push(myJson[rand]);
        for (let index = 0; index < answerLength - 1; index++) {
          options.push(myJson[getRandomCountry(myJson)]);
        }
        let shuffled = options
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        setQuestionOptions(shuffled);
      });
  };

  const getRandomCountry = (countries, excludeId) => {
    return Math.round(Math.random() * (countries.length - 1));
  };

  const checkAnswer = (answer) => {
    return () => {
      if (answer === currentCountry.alpha2) {
        // alert('Correct!');
        setCorrectAnswer(true);
        setScore(score + 1);
        setQuestionsAnswered(questionsAnswered + 1);
        console.log('Score', score);
        console.log('Questions Answered', questionsAnswered);
      } else {
        // alert('Wrong! it was ' + currentCountry.en + '!');
        setCorrectAnswer(false);
        setQuestionsAnswered(questionsAnswered + 1);
        console.log('Questions Answered', questionsAnswered);
      }
      getCountries();
    };
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        {/* <p>Current Country: {currentCountry.en}</p> */}
        {questionsAnswered > 0 && (
          <p>{correctAnswer ? <>Correct</> : <>Wrong</>}</p>
        )}
        <p>
          Score: {score} : {questionsAnswered} (questions answered)
        </p>
        <img src={`assets/128x128/${currentCountry.alpha2}.png`} alt='logo' />

        <div className='optionsWrapper'>
          {questionOptions.map((option) => {
            return (
              <button className='App-link' onClick={checkAnswer(option.alpha2)}>
                {option.en}
              </button>
            );
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
