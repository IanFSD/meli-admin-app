const axios = require('axios'),
    rateLimit = require('axios-rate-limit'),
    user_id = '320124044',
    token = 'APP_USR-7454920267188712-033114-7bb8edeb35e3749fed95931bd316829d-320124044',
    maxIds = 10000,
    categorias = [
        'MLA373135',
    ],
    api = rateLimit(axios.create({headers: {Authorization: `Bearer ${token}`}}),
        {maxRequests: 4, perMilliseconds: 1000, maxRPS: 4});


function chunkArray(myArray, chunk_size = 20) {
    // eslint-disable-next-line prefer-const
    const arrayLength = myArray.length,
        tempArray = [];
    for (let index = 0; index < arrayLength; index += chunk_size) {
        const myChunk = myArray.slice(index, index + chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }
    return tempArray;
}

async function listItems() {
    const items = await api.get(`https://api.mercadolibre.com/users/${user_id}/items/search`)
    console.log(items.data.paging);
}

async function getItemIds() {

    let idList = [],
        url = `https://api.mercadolibre.com/users/${user_id}/items/search`;
    console.debug(`Obtengo la lista de id de publicaciones`);
    let item = await api.get(url + '?search_type=scan');
    console.log(`Ids leidos ${idList.length} de ${item.data.paging.total}`);
    if (item.data.paging.total < item.data.paging.limit) {
        idList = idList.concat(item.data.results)
    } else {
        idList = idList.concat(item.data.results);
        let scroll_id = item.data.scroll_id;
        while (idList.length < item.data.paging.total) {
            // while (idList.length < maxIds) {
            url = `https://api.mercadolibre.com/users/${user_id}/items/search`;
            item = await api.get(url, {search_type: 'scan', scroll_id: scroll_id});
            scroll_id = item.data.scroll_id;
            idList = idList.concat(item.data.results);
            console.log(`Ids leidos ${idList.length} de ${item.data.paging.total}`);
        }
    }
    return idList;
}

async function deleteItem(id, status) {
    const url = `https://api.mercadolibre.com/items/${id}`;
    try {
        if (status === 'paused') {
            let resClosed = await api.put(url, {status: "closed"})
            console.log('closed ', resClosed.data.id, resClosed.data.category_id, resClosed.data.title, resClosed.data.status, resClosed.data.sub_status)
        }
        let resDeleted = await api.put(url, {deleted: "true"})
        console.log('deleted', resDeleted.data.id, resDeleted.data.category_id, resDeleted.data.title, resDeleted.data.status, resDeleted.data.sub_status)
    } catch (err) {
        console.error('Error al eliminar el item ' + id, err.data ? err.data : (err.response && err.response.data ? err.response.data : err))
    }
}

async function downloadItemsFromMeli(ids) {
    let count = 0;
    const url = `https://api.mercadolibre.com/items`,
        items = await api.get(url + `?ids=${ids.join(',')}`);
    for (const item of items.data) {
        if (item.code === 200) {
            const meliItem = item.body;
            // console.log(item.code, meliItem.id, meliItem.category_id, meliItem.title, meliItem.status, meliItem.sub_status)
            // if (categorias.find(x => x === meliItem.category_id)
            // &&
            // (
            //     (meliItem.status === 'paused' /*&& !(meliItem.sub_status.find(x => x === 'suspended'))*/) ||
            //     (meliItem.status === 'closed' /*&& !(meliItem.sub_status.find(x => x === 'deleted'))*/)
            // )
            // ) {
            if (meliItem.title.indexOf('Cilindro De Freno') >= 0 ||
                meliItem.title.indexOf('Cilindro De Embrague') >= 0 ||
                meliItem.title.indexOf('Campanas De Freno') >= 0||
                meliItem.title.indexOf('Discos De Freno') >= 0
                ) {
                console.log(item.code, meliItem.id, meliItem.category_id, meliItem.title, meliItem.status, meliItem.sub_status)
                await deleteItem(meliItem.id, meliItem.status)
                count++;
            } else {
                // console.log(meliItem.title)
            }
        } else {
            console.log(`Llego un item con codigo distinto de 200 - ${JSON.stringify(item)}`)
        }
    }
    return count;
}

async function processIds(idList) {
    let count = 0;
    // obtengo todas las publicaciones
    console.log(`Obtengo ${idList.length} publicaciones`);
    const chunks = chunkArray(idList);
    for (let i = 0; i < chunks.length; i++) {
        console.log(`Proceso ${i} de ${chunks.length} bloques`);
        count += await downloadItemsFromMeli(chunks[i])
    }
    return count;
}

async function main() {
    let idList = await getItemIds(),
        res = await processIds(idList);
    while (res > 0) {
        idList = await getItemIds();
        res = await processIds(idList);
        console.log(res)
    }
    await listItems();
}


main();