## why this file
handles the dirrty work ;

- API calls
- localStorage
- data formatting
## how it's done
1. define interfaces ; types ..
this will help in debugging later as the logic grows trust me you an not remember everything
```
# interface
export interface Shipement{
    id: string;
    status: string;
}
# types
export type person = {
    id : number;
    name: string;
    ships: Shipment[]
}
# enums "Const Assertions"
const options = ['one','two','three'] as const;
export type Options = typeof options[number]
// here at runtime we can add more things. Options.includes(something)
```
2. API delay
frankly API call are a bit slow, so if you are on early step, simulate the timeout, so you build on top of that short cumming instead of getting it later on
```
await new Promise(res => setTimeout(res, 1500))// sec and 500 min sec it can even be larger than this, but if that service is slow by itself, comment this later on

or fetch really

const [result] = fetch(links.forthis..);
if(...)// the state of answer
so you know what you are using

<!-- hydrate the answer -->
const answer: typeToFollow = {...result,..} // match the formart you want
```
3. localStorage
Most of the time, we don't want to kep caling the API, but we want data to be kept , on refresh or url path changes as longer as our session steal stand, we still need to see our data around. we storae them locally

```
localStorage.setItem('key',typeof(value)!=="string"? JSON.stringfy(value): value)
// this value need to be stringfied if it is not a string
```
> that is fetching : fetch, update the localStorage. Always work in try catch
4. update
we will need to adjust data both locally and tell database to adjust the records
```
const ans = await fetch(ulr,methadat)// for these fetchs, we need to specify the protocal, as we manuver the post man clicking here ther, on client side we need to explicitly say so. that would be point 5.
const new = ...;
localstorage.setItem('needs',typeof(new)!=="string"? JSON.stringfy(new): new)

```
5. methods / header / body
   the structure is
   `await fetch(url:string, {method:..,headers:...,body:...});`
    1. Methods
        get,post,put,patch,delete
    2. header
        - 'content-Type' // what we are sending `application/json` for json or `application/x-www-form-urlencoded` to get parms from url
        - 'Accept' // what i will receive from backend mostly `application/json`
        - 'Authorization' // for Bears token in JWT but here in session we are ok, it is servee that remembers us not client remembering servers it would be `Bearer ${my_token}
        - 'Creadential that is to be used in middel way very important // 'X-chamberID': 'ROOM_245'
    3. body
        here make sure you math your body to header, when it come to what you send.
        - Sending Json/// headers = apllication /json  ; body JSON.stringfy({key:value,..,...})
        - sending FormData // anything other than text/ files, qr scans.
          - create the form data well types
            ```
            const form = new FormData();
            form.append('key',value);
            here value can now also be a file
            fileInput.files[0]
            ```
            Most of times if the body is formData, skep the headers, let thebrowser infer it,
        - url Seracharams///
### Summary:
- path parameter// req.params
```
// GET /api/shipment/SHIP_99
app.get('/api/shipment/:id', (req, res) => {
  const id = req.params.id; // "SHIP_99"
  console.log(`Searching for shipment: ${id}`);
});
```
- query parameters //req.quey
```
// GET /api/shipments?status=pending&limit=10
app.get('/api/shipments', (req, res) => {
  const { status, limit } = req.query; // { status: "pending", limit: "10" }
  console.log(`Filtering by ${status}`);
});
```
- body //req.body
```
// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body; // { username: "Shema", password: "..." }

  // If you used URLSearchParams or JSON, it still ends up in req.body
  console.log(`Login attempt for ${username}`);
});
```
1. hydarate in hooks
> check in hooks folder detail.md
