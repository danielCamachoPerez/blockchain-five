const express = require("express");
const app = express();
const { pejecoin, Transactions } = require("./src/blockchain");
const { ec } = require("elliptic");
const EC = new ec("secp256k1");
const cors = require("cors");
const port = 3500;

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.listen(port, () => console.log(`Listen on port ${port}`));
app.use(express.json());

app.get("/", (req, res) => {
    res.json(pejecoin.chain);
});

app.post("/transaction", (req, res) => {
    const { key, to, amount } = req.body;
    if (key === "" || to === "" || amount === "") {
        res.json({ message: "missing values!" });
    }

    const myKey = EC.keyFromPrivate(key);
    const myWallet = myKey.getPublic("hex");

    const newTransaction = new Transactions(myWallet, to, amount);
    newTransaction.signTransaction(myKey);
    pejecoin.createTransaction(newTransaction);

    pejecoin.minePendingTransactions(myWallet);

    res.json({
        message: "Done!",
        data: pejecoin.chain,
        balance: pejecoin.getBalance(key),
    });
});

app.get("/balance/:id", (req, res) => {
    const { id } = req.params;
    const myKey = EC.keyFromPrivate(id);
    const myWallet = myKey.getPublic("hex");

    res.json({ balance: pejecoin.getBalance(myWallet) });
});

//coin(req.query.from, req.query.to, req.query.amount);