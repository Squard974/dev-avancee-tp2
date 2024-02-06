import {getData} from "./api.js";

import fastify from 'fastify';
import fastifyView from '@fastify/view';
import handlebars from 'handlebars';

console.log("Je suis Marvel")
getData("http://gateway.marvel.com/v1/public/characters")

const app = fastify();

const loadPartials = async () => ({
    header: './header.hbs',
    footer: './footer.hbs',
});

app.register(fastifyView, {
    engine: { handlebars },
    templates: './templates',
    options: {
        partials: await loadPartials(),
    },
});

app.get('/', async (request, reply) => {
    //getData pour récupérer les données des personnages
    const charactersData = await getData("http://gateway.marvel.com/v1/public/characters");

    // Vérifier que les données existent et sont dans le bon format
    if (charactersData && charactersData.length > 0) {
        // Utiliser reply.view pour rendre le fichier index.hbs en passant les données
        return reply.view('index', { characters: charactersData });
    } else {
        // Gérer le cas où les données ne sont pas disponibles
        return reply.code(500).send('Erreur lors de la récupération des données des personnages.');
    }
});

app.listen({ port: 3000 }, (err) => {
    if (err) throw err;
    console.log('Serveur en écoute sur le port 3000');
});