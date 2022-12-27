import { useEffect, useState } from 'react';
import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { useColorScheme } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Main() {
  const [countries, setCountries] = useState([]);
  const [complete, setComplete] = useState(false);
  const [currentCountry, setCurrentCountry] = useState('');
  const [questionOptions, setQuestionOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const answerLength = 4;
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [listOfAnswers, setListOfAnswers] = useState([]);
  const [usedIds, setUsedIds] = useState([]);
  const [highestScore, setHighestScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    const initialValue = JSON.parse(saved);
    return initialValue || 0;
  });

  useEffect(() => {}, []);

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
        setCountries(myJson);
        const rand = getRandomCountry(myJson);

        setCurrentCountry(rand);

        const options = [];
        options.push(rand);

        for (let index = 0; index < answerLength - 1; index++) {
          options.push(getRandomCountry(myJson));
        }
        let shuffled = options
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        setQuestionOptions(shuffled);
      });
  };

  const getRandomCountry = (countries) => {
    const selectedCountry =
      countries[Math.round(Math.random() * (countries.length - 1))];
    if (usedIds.includes(selectedCountry.id)) {
      return getRandomCountry(countries);
    } else {
      setUsedIds([...usedIds, selectedCountry.id]);
      return selectedCountry;
    }
  };

  const checkAnswer = (answer) => {
    return () => {
      const data = {
        country: currentCountry,
        countryName: currentCountry.en,
        questionOptions: questionOptions,
      };
      if (answer === currentCountry.alpha2) {
        data.correct = true;
        setCorrectAnswer(true);
        setScore(score + 1);
        setQuestionsAnswered(questionsAnswered + 1);
      } else {
        data.correct = false;
        setCorrectAnswer(false);
        setQuestionsAnswered(questionsAnswered + 1);
      }
      setListOfAnswers([data, ...listOfAnswers]);
      if (score === countries.length - 1) {
        setComplete(true);
      }
      getCountries();
    };
  };

  useEffect(() => {
    getCountries();
  }, []);

  const resetGame = () => {
    setHighScore();
    setScore(0);
    setQuestionsAnswered(0);
    setListOfAnswers([]);
    getCountries();
  };

  const setHighScore = () => {
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem('highScore', JSON.stringify(score));
    }
  };

  const { mode, setMode } = useColorScheme();

  if (complete) {
    return (
      <div className='App'>
        <h1>You've completed the game</h1>

        <img src={`assets/well-done.gif`} alt='logo' />
      </div>
    );
  }

  return (
    <div className='App'>
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Grid container justifyContent='flex-end' sx={{ mb: 2 }}>
          <Item>
            <Chip label={`Highest score: ${highestScore}`} />
            <Button
              variant='outlined'
              onClick={resetGame}
              color='primary'
              sx={{ mx: 2 }}
            >
              Reset
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                if (mode === 'light') {
                  setMode('dark');
                } else {
                  setMode('light');
                }
              }}
            >
              {mode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </Item>
        </Grid>
        <Grid container spacing={1}>
          <Grid xs={12} md={4} order={{ xs: 2, md: 1 }}>
            <Item>
              <h2>Your Answers</h2>
              <ul>
                {listOfAnswers.map((answer) => {
                  console.log(answer);
                  return (
                    <li>
                      {answer.correct ? (
                        <span style={{ color: 'green' }}>Correct</span>
                      ) : (
                        <span style={{ color: 'red' }}>Wrong</span>
                      )}{' '}
                      - {answer.countryName} - {'Your options were:'}{' '}
                      <span style={{ fontSize: 8 }}>
                        {answer.questionOptions.map((option) => {
                          return <>{option.en}, </>;
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Item>
          </Grid>
          <Grid xs={12} md={8} order={{ xs: 1, md: 2 }}>
            <Item>
              {questionsAnswered > 0 && (
                <p>{correctAnswer ? <>Correct</> : <>Wrong</>}</p>
              )}
              <p>
                Score: {score} : {questionsAnswered} (questions answered)
              </p>
              <img
                src={`assets/128x128/${currentCountry.alpha2}.png`}
                alt='Flag'
              />

              <div className='optionsWrapper'>
                {questionOptions.map((option) => {
                  return (
                    <Box sx={{ mb: 1 }} key={option.id}>
                      <Button
                        variant='contained'
                        onClick={checkAnswer(option.alpha2)}
                      >
                        {option.en}
                      </Button>
                    </Box>
                  );
                })}
              </div>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Main;
