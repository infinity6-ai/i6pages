// Serve this repo's root: python -m http.server 8000 -> http://localhost:8000/infer-demo/
// The SDK comes from the published bundle (index.html), not from source: this page tests what the CDN serves.
const { I6Sdk } = window

// infer.js prints what it does when this is set (the log panel below shows it)
window.I6_DEBUG = true

const $ = (id) => document.getElementById(id)

// --- log ---------------------------------------------------------------------------------------------
const consoleLog = console.log
const log = (...args) => {
  // One blank line between logs
  const logEl = $('log')
  logEl.textContent += args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ') + '\n\n'
  logEl.scrollTop = logEl.scrollHeight
}
console.log = (...args) => { consoleLog(...args); log(...args) }
$('clearlog').onclick = () => { $('log').textContent = '' }

// --- session -----------------------------------------------------------------------------------------
// What the SDK user passes to `new I6Sdk(...)`. The session lives as long as the tab; the user is kept across visits.
const stored = (storage, key) => {
  try {
    return storage.getItem(key) ?? (storage.setItem(key, crypto.randomUUID()), storage.getItem(key))
  } catch { return crypto.randomUUID() }
}
const sdkConfig = { 
  baseUrl: "https://decsuite.sandbox.rs.infinity6.ai",
  userExchangeCallbackUrl: new URL('./logincallback.html', location.href).href,
}
// The config the SDK really runs with: the defaults (baseUrl) merged with ours
const sdk = new I6Sdk()
sdk.setConfig(sdkConfig)
await sdk.auth().handleCallback()
window.i6sdk = sdk

// The session lives as long as the tab; the user is kept across visits.
const sessionId = stored(sessionStorage, 'i6demo.sessionId')
const userId = stored(localStorage, 'i6demo.userId')
const showConfig = () => { $('sdkConfig').textContent = JSON.stringify(sdk.config(), null, 2) }
showConfig()
log('sdk config', sdk.config())

// What the SDK user passes as selectResults: picks the skus that are shown. Shown in the usage card as is.
// Here: best rated results first, no sku that is already in the cart, no sku twice, at most 4, with their slot in the carousel.
// The SDK adds the rating of each sku. Without selectResults, the SDK shows one random sku.
async function selectResults(req, { results }) {
  const inCart = new Set(req.input.skus.map((sku) => sku.sku_id))
  const shown = new Set()
  for (const result of [...results].sort((a, b) => b.rating - a.rating)) {
    for (const { sku_id } of result.skus) {
      if (!inCart.has(sku_id)) shown.add(sku_id)
    }
  }
  return {
    results: [...shown].slice(0, 4).map((sku_id, slot) => ({ sku_id, enriched: { slot } })),
  }
}

// --- what the SDK user passes in ---------------------------------------------------------------------
// The request of sdk.funcs().productRelevanceFashionFbtV1, from the config card.
function funcsRequest() {
  const text = (id) => $(id).value.trim()
  return {
    input: {
      dataset: text('dataset'),
      session_id: sessionId,
      user_id: userId,
      skus: text('sku_ids').split(/[\s,]+/).filter(Boolean).map((sku_id) => ({ sku_id })),
    },
    partitions: { store_id: text('storeId'), version: text('modelVersion') },
  }
}

// The opts of sdk.funcs().*, from the config card: the dataset token, or none
function serviceOpts() {
  const datasetToken = $('datasetToken').value.trim()
  return datasetToken ? { datasetToken } : undefined
}
// The opts as written in the usage code; the token itself is not shown on the page
const usageOpts = () => (serviceOpts() ? ', { datasetToken: "<your token>" }' : '')

// The code of the SDK user, written with the values of the config card. Shown at the top of the page and run by the button
function usage() {
  return `// <script src="https://cdn.infinity6.ai/releases/sdkweb/latest/bundle/i6sdk-web.js"></script>  (sets window.I6Sdk)

const sdk = new I6Sdk()
sdk.setConfig(${JSON.stringify(sdkConfig)}) // anytime; overwrites only the given keys

${selectResults}

const result = await sdk.funcs().productRelevanceFashionFbtV1(${JSON.stringify(funcsRequest(), null, 2)}, selectResults${usageOpts()})`
}
for (const id of ['modelName', 'modelVersion', 'storeId', 'dataset', 'sku_ids', 'datasetToken']) $(id).addEventListener('input', () => { $('usage').textContent = usage() })
$('usage').textContent = usage()

// --- run ---------------------------------------------------------------------------------------------
const setStatus = (status) => {
  const badge = $('step').querySelector('.badge')
  badge.textContent = status
  badge.className = `badge ${status}`
}

$('run').onclick = async () => {
  const card = $('step')
  const req = funcsRequest()
  setStatus('running')
  card.querySelector('.in').textContent = JSON.stringify(req, null, 1)
  card.querySelector('.out').textContent = ''
  try {
    const result = await sdk.funcs().productRelevanceFashionFbtV1(req, selectResults, serviceOpts())
    // const result = await sdk.funcs().productRelevanceFashionFbtV1(req)
    card.querySelector('.out').textContent = JSON.stringify(result, null, 1)
    setStatus('ok')
  } catch (e) {
    card.querySelector('.out').textContent = `${e.name} [${e.code}] ${e.message}`
    console.log(`ERROR infer run: ${e.name} [${e.code}] ${e.message}`)
    setStatus('error')
  }
}

// --- tensors -----------------------------------------------------------------------------------------
// infer.js announces what went into and came out of the model when I6_DEBUG is set
let lastTensors = null
const describeTensors = (declared, values) =>
  Object.entries(values).map(([name, value]) => {
    const detail = declared.find((d) => d.name === name)
    const data = value.data ?? value // inputs are {data, shape}; outputs are the values
    return `${name}  dtype=${detail?.dtype}  shape=[${value.shape ?? detail?.shape}]  values=${data.length}\n${JSON.stringify(data)}`
  }).join('\n\n')

window.addEventListener('i6:infer-tensors', ({ detail }) => {
  lastTensors = detail
  $('tensorsBadge').textContent = `${detail.modelName} ${JSON.stringify(detail.partitions)}`
  $('tensorsModel').textContent = `model declares: ${JSON.stringify(detail.model)}`
  $('tensorsIn').textContent = describeTensors(detail.model.inputs, detail.inputs)
  $('tensorsOut').textContent = describeTensors(detail.model.outputs, detail.outputs)
})
$('copyTensors').onclick = () => navigator.clipboard?.writeText(JSON.stringify(lastTensors, null, 1))

// --- dash --------------------------------------------------------------------------------------------
function dashRequest() {
  const text = (id) => $(id).value.trim()
  return {
    input: { dataset: text('dashDataset'), params: { min_year_month: text('minYearMonth'), max_year_month: text('maxYearMonth') } },
    partitions: { store_id: text('dashStoreId'), version: text('dashVersion') },
  }
}

const dashUsage = () => `const result = await new I6Sdk().funcs().${$('dashFunc').value}(${JSON.stringify(dashRequest(), null, 2)}${usageOpts()})`
const dashIds = ['dashFunc', 'dashDataset', 'dashStoreId', 'dashVersion', 'minYearMonth', 'maxYearMonth']
for (const id of [...dashIds, 'datasetToken']) $(id).addEventListener('input', () => { $('dashUsage').textContent = dashUsage() })
$('dashUsage').textContent = dashUsage()

const setDashStatus = (status) => {
  $('dashBadge').textContent = status
  $('dashBadge').className = `badge ${status}`
}

$('dashRun').onclick = async () => {
  const req = dashRequest()
  setDashStatus('running')
  $('dashIn').textContent = JSON.stringify(req, null, 1)
  $('dashOut').textContent = ''
  try {
    const result = await sdk.funcs()[$('dashFunc').value](req, serviceOpts())
    $('dashOut').textContent = JSON.stringify(result, null, 1)
    setDashStatus('ok')
  } catch (e) {
    $('dashOut').textContent = `${e.name} [${e.code}] ${e.message}`
    console.log(`ERROR dash run: ${e.name} [${e.code}] ${e.message}`)
    setDashStatus('error')
  }
}

// --- pages -------------------------------------------------------------------------------------------
// The tabs show the cards of one page (data-page); cards without data-page (auth, log) are on every page. The page is kept in the URL hash.
const pages = [...document.querySelectorAll('.tabs [data-tab]')].map((b) => b.dataset.tab)
function showPage(page) {
  if (!pages.includes(page)) page = pages[0]
  document.querySelectorAll('[data-page]').forEach((el) => el.classList.toggle('hidden', el.dataset.page !== page))
  document.querySelectorAll('.tabs [data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === page))
  if (location.hash.slice(1) !== page) history.replaceState(null, '', `#${page}`)
}
document.querySelectorAll('.tabs [data-tab]').forEach((b) => { b.onclick = () => showPage(b.dataset.tab) })
window.addEventListener('hashchange', () => showPage(location.hash.slice(1)))
showPage(location.hash.slice(1))

// --- tools -------------------------------------------------------------------------------------------
// Redirects to the login page when nobody is signed in, and comes back here
$('login').onclick = async () => {
  try {
    const user = await sdk.auth().requireUser()
    if (user) log('logged in as', user)
  } catch (e) {
    log(`ERROR login: ${e.message}`)
  }
}

$('clear').onclick = async () => {
  await (await navigator.storage.getDirectory()).removeEntry('i6', { recursive: true }).catch(() => { })
  log('opfs cache removed')
}

window.onunhandledrejection = (e) => log(`ERROR ${e.reason.name} [${e.reason.code}] ${e.reason.message}`)
