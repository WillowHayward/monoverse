import { Lipwig } from '@whc/lipwig/js';
import { Game } from './app/game';

const txtName: HTMLInputElement = document.getElementById('txtName') as HTMLInputElement;
const txtCode: HTMLInputElement = document.getElementById('txtCode') as HTMLInputElement;
const btnJoin: HTMLButtonElement = document.getElementById('btnJoin') as HTMLButtonElement;

const LIPWIG_URL = 'ws://localhost:8989';

function setJoin() {
    const canJoin = txtName.value.length > 0 && txtCode.value.length > 0 ;
    btnJoin.disabled = !canJoin;
}

txtName.addEventListener('input', setJoin);
txtCode.addEventListener('input', setJoin);

btnJoin.addEventListener('click', () => {
    const name = txtName.value;
    const code = txtCode.value;

    btnJoin.disabled = true;

    console.log('joining');
    Lipwig.join(LIPWIG_URL, code, { data: { name } }).then(client => {
        console.log('joined');
        new Game(client, name);
    }).catch(() => {
        alert('Could not join room');
        setJoin();
    });
});
