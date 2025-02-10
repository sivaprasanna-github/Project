    const searchBtn = document.getElementById('search-btn');
    const suggestionsDiv = document.getElementById("suggestions");
    const result = document.getElementById("result");
    const sound = document.getElementById("sound");

    const clearSuggestions = () => suggestionsDiv.innerHTML = '';
    const clearResult = () => result.innerHTML = '';
    // dictionary starts
    const handleSearch = async (word) => {
        if (!word) return;

        clearSuggestions();
        clearResult();
        loadingSpinner.style.display = 'block';

        try {
            //main api for word search using api.dictionaryapi.dev
            const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const dictionaryData = await dictionaryResponse.json();
            console.log(dictionaryData);
            loadingSpinner.style.display = 'none';
            let main = document.createElement("div");
            main.className = "main-word-section";
            main.innerHTML = `<div class="main-word"><strong>${word}</strong></div>`;
            let audioEntry = dictionaryData[0].phonetics.find(p => p.audio);
            let audioUrl = audioEntry?.audio || "";
            if (audioUrl) {
                main.innerHTML += `<button onclick="playSound()">
                    <i class="fas fa-volume-up speaker-icon"></i>
                </button>`;
                sound.setAttribute("src", audioUrl);
            }
            result.appendChild(main);
            setTimeout(() => main.classList.add('show-content'), 150);


            let phoneticEntry = dictionaryData[0].phonetics.find(p => p.text);
            let phonetic = phoneticEntry?.text || "";
            if (phonetic) {
                let phoneticDiv = document.createElement("div");
                phoneticDiv.className = "phonetic";
                phoneticDiv.innerHTML = `<strong>Phonetic:</strong> ${phonetic}`;
                result.appendChild(phoneticDiv);
                setTimeout(() => phoneticDiv.classList.add('show-content'), 300);
            }

            const partOfSpeechList = dictionaryData[0].meanings.map(meaning => meaning.partOfSpeech);
            let partOfSpeechDiv = document.createElement("div");
            partOfSpeechDiv.className = "part-of-speech";
            partOfSpeechDiv.innerHTML = `<strong>Part of Speech:</strong> ${partOfSpeechList.join(', ')}`;
            result.appendChild(partOfSpeechDiv);
            setTimeout(() => partOfSpeechDiv.classList.add('show-content'), 450); 


            let definition = dictionaryData[0].meanings.find(m => m.definitions[0].definition)?.definitions[0].definition || "";
            if (definition) {
                let definitionDiv = document.createElement("div");
                definitionDiv.className = "definition";
                definitionDiv.innerHTML = `<strong>Definition:</strong> ${definition}`;
                result.appendChild(definitionDiv);
                setTimeout(() => definitionDiv.classList.add('show-content'), 600);
            }
            let example = findExampleWithWord(dictionaryData[0].meanings, word) || dictionaryData[0].meanings.find(m => m.definitions.find(d => d.example))?.definitions[0].example || "";
            if (example) {
                let exampleDiv = document.createElement("div");
                exampleDiv.className = "example";
                exampleDiv.innerHTML = `<strong>Example:</strong> ${example}`;
                result.appendChild(exampleDiv);
                setTimeout(() => exampleDiv.classList.add('show-content'), 750);
            }

            // Fetch synonyms and antonyms from thesaurus api
            const thesaurusApiUrl = "https://thesaurus-by-api-ninjas.p.rapidapi.com/v1/thesaurus?word=";
            const thesaurusOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '172be0fd3dmshd8f189ff539b4d7p1ea48bjsn2d27fa8a4e9c',
                    'x-rapidapi-host': 'thesaurus-by-api-ninjas.p.rapidapi.com'
            }
            };
            const thesaurusResponse = await fetch(`${thesaurusApiUrl}${word}`, thesaurusOptions);
            const thesaurusData = await thesaurusResponse.json();
            let synonyms = thesaurusData.synonyms.slice(0, 10);
            let antonyms = thesaurusData.antonyms.slice(0, 10);
            console.log(antonyms)
            console.log(synonyms)
            if (synonyms.length > 1){
                
                let synonymsDiv = document.createElement("div");
                synonymsDiv.className = "synonyms";
                synonymsDiv.innerHTML = `<strong>Synonyms:</strong> ${synonyms.join(', ')}`;
                result.appendChild(synonymsDiv);
                setTimeout(() => { synonymsDiv.classList.add('show-content');
                });
            }
            if (antonyms.length > 1){
                
                let antonymsDiv = document.createElement("div");
                antonymsDiv.className = "antonyms";
                antonymsDiv.innerHTML = `<strong>antonyms:</strong> ${antonyms.join(', ')}`;
                result.appendChild(antonymsDiv);
                setTimeout(() => {antonymsDiv.classList.add('show-content');
                });
            }
            // fetch images from unsplash api
            const imageResponse = await fetch(`https://api.unsplash.com/search/photos?query=${word}&client_id=nqqN5PrwcgdzEng3auwnBrYtZrzfFv7lSFFmyDMnBCE&per_page=12`);
            const imageData = await imageResponse.json();
            const images = imageData.results;

            if (images.length) {
                let imagesHtml = '<div class="images">';
                images.forEach(image => {
                    imagesHtml += `<img src="${image.urls.small}" alt="${word} image">`;
                });
                imagesHtml += '</div>';
                result.innerHTML += imagesHtml;
                setTimeout(() => document.querySelector('.images').classList.add('show-content'), 1000); 
            } else {
                result.innerHTML += `<p class="error">No images found for "${word}".</p>`;
            }

        }catch (err) {
            result.innerHTML = "<p>Couldn't find the word</p>"
            console.error("Error fetching dictionary data:", err);
            loadingSpinner.style.display = 'none';
        }
    };

    document.getElementById("inp-word").addEventListener("input", async () => {
        const inpWord = document.getElementById("inp-word").value;
        if (inpWord.length < 2) {
            return clearSuggestions();
        }

        try {
            //fetch suggestion words using datamuse api
            const response = await fetch(`https://api.datamuse.com/sug?s=${inpWord}`);
            const data = await response.json();
            clearSuggestions();

            data.forEach(suggestion => {
                const suggestionDiv = document.createElement('div');
                suggestionDiv.textContent = suggestion.word;
                suggestionDiv.addEventListener('click', async () => {
                    document.getElementById("inp-word").value = suggestion.word;
                    clearSuggestions();
                   // await handleSearch(suggestion.word);
                });
                suggestionsDiv.appendChild(suggestionDiv);
            });
        } catch (err) {
            console.error("Error fetching suggestions:", err);
        }
    });

    searchBtn.addEventListener("click", async () => {
        const word = document.getElementById("inp-word").value;
        await handleSearch(word);
    });
    let searchbar= document.getElementById("inp-word")
    searchbar.addEventListener("keypress",async (e)=>{
        if(e.key==="Enter"){
            const word = searchbar.value;
            await handleSearch(word)
        }
    })

    const playSound = () => {
        if (sound.src) {
            sound.play();
        }
    };

    function findExampleWithWord(meanings, word) {
        for (let meaning of meanings) {
            for (let definition of meaning.definitions) {
                if (definition.example && definition.example.includes(word)) {
                    return definition.example;
                }
            }
        }
        return null;
    }
