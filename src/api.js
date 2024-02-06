import {createHash} from 'node:crypto'

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    let ts = new Date().getTime()
    let publicKey = "361124b7737967445b1ee399a9fd3846"
    let privateKey = "875674f8520063d42315708994ac56cfe874eda7"
    let hash = await getHash(ts, privateKey, publicKey)

    let completeUrl = url + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash
    console.log(completeUrl)
    //https://gateway.marvel.com/v1/public/characters?ts=1707185049623&apikey=361124b7737967445b1ee399a9fd3846&hash=7d31418eb53dbd0016760110f2eb03a1
    return await fetch(completeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Filtrer les personnages avec une thumbnail valide
            const filteredCharacters = data.data.results.filter(character =>
                character.thumbnail.path !== "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"
            );

            console.log(filteredCharacters);

            // Tableau des personnages avec portraix_xlarge
            const charactersWithImageUrl = filteredCharacters.map(character => ({
                id: character.id,
                name: character.name,
                imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
            }));

            console.log(charactersWithImageUrl);
            return charactersWithImageUrl;

        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        })
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (timestamp, privateKey, publicKey) => {
    return createHash('md5').update(timestamp + privateKey + publicKey).digest('hex');

}
