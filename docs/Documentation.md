
## Fonctions principales :

### Fonctions fetch

Les fonctions fetch sont utilisées pour récupérer des données à partir d'une API. Elles utilisent généralement la méthode GET pour demander des données à un serveur. Dans le code que vous avez fourni, `fetchCardDetails` et `fetchListsAndCards` sont des exemples de fonctions fetch. Elles récupèrent respectivement les détails d'une carte et les listes et cartes d'un tableau à partir de l'API Trello.

### Fonctions create

Les fonctions create sont utilisées pour créer de nouvelles données dans une API. Elles utilisent généralement la méthode POST pour envoyer des données à un serveur. Dans le code que vous avez fourni, `createList` et `createCard` sont des exemples de fonctions create. Elles créent respectivement une nouvelle liste et une nouvelle carte sur le tableau Trello.

### Fonctions delete

Les fonctions delete sont utilisées pour supprimer des données d'une API. Elles utilisent généralement la méthode DELETE pour demander la suppression de données à un serveur. Dans le code que vous avez fourni, `confirmDeleteList` et `deleteCard` sont des exemples de fonctions delete. Elles suppriment respectivement une liste et une carte du tableau Trello.

### Fonctions edit

Les fonctions edit sont utilisées pour modifier des données existantes dans une API. Elles utilisent généralement la méthode PUT ou PATCH pour envoyer des données mises à jour à un serveur. Dans le code que vous avez fourni, il n'y a pas d'exemple de fonction edit. Cependant, une fonction edit typique pourrait ressembler à une fonction create, mais utiliserait une méthode PUT ou PATCH et inclurait l'ID de l'objet à modifier dans l'URL de la requête.