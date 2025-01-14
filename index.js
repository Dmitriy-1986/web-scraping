const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Добро пожаловать на сервер Express! Используйте /scrape для веб-скрапинга.');
});

app.get('/scrape', async (req, res) => {
  try {
    const response = await axios.get('https://dovgaldima.pp.ua');
    const $ = cheerio.load(response.data);

    const data = {
      h2: [],
      ul: [],
      p: [],
      img: [],
      a: []
    };

    // Извлечение содержимого из тегов <h2>
    $('h2').each((index, element) => {
      const text = $(element).text();
      data.h2.push( text );
    });

    // Извлечение содержимого из тегов <ul> и <li>
    $('ul').each((index, element) => {
      const ulContent = [];
      $(element)
        .find('li')
        .each((i, li) => {
          ulContent.push($(li).text());
        });
      data.ul.push( ulContent );
    });

    // Извлечение содержимого из тегов <p>
    $('p').each((index, element) => {
      const text = $(element).text();
      data.p.push( text );
    });

    // Извлечение содержимого из тегов <img>
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || 'Без описания';
      if (src) {
        data.img.push({ src, alt });
      }
    });

    // Извлечение содержимого из тегов <a>
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text() || 'Без текста';
      if (href) {
        data.a.push({ href, text });
      }
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка скрапинга', error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
