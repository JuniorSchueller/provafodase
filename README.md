# provafodase
script baseado em um já existente.

pra acessar basta digitar qualquer coisa na barra, abra a prova e clique no botãozinho preto no canto inferior esquerdo na página.

crie bookmarklet e use na página da prova:
```js
javascript:(function(){var s=document.createElement('script');s.src="https://cdn.jsdelivr.net/gh/JuniorSchueller/provafodase@latest/prova.js";document.body.appendChild(s);})();```
