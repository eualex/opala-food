const URL = {
  API_HOST: 'http://localhost:1337'
}

class ItemMapper {
  static toItem(rawItem) {
    return {
      name: rawItem.attributes.name,
      image: {
        alt: rawItem.attributes.image.data.attributes.alternativeText,
        url: `${URL.API_HOST}${rawItem.attributes.image.data.attributes.formats.thumbnail.url}`
      },
      variants: rawItem.attributes.variants.data.map(variant => ({
        title: variant.attributes.title,
        value: Intl.NumberFormat('pt-BR', { style: "currency", currency: 'BRL' }).format(variant.attributes.value)
      }))
    }
  }
}

async function loadItems() {
  const response = await fetch(`${URL.API_HOST}/api/items/?populate=*`)
  const items = await response.json()
  return items.data.map(ItemMapper.toItem)
}

export async function handleItems() {
  const itemsContainer = document.querySelector('.itens-cardapio')
  const items = await loadItems()
  let itemsTemplate = ''
  items.forEach(item => {
    itemsTemplate += `
    <div>
      <img src=${item.image.url} alt=${item.image.alt}>
      <div class="info">
        <h3>${item.name}</h3>
        ${item.variants.reduce((acc, variant) => {
          acc += `<h4>${variant.title}<span>${variant.value}</span></h4>`
          
          return acc
        }, '')}
        <button class="pedir">Adicionar ao carrinho</button>
      </div>
    </div>
  `
  })
  itemsContainer.innerHTML = itemsTemplate
}