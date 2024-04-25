document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.menu').forEach(button => {
        button.addEventListener('click', function(){
            let prevChosenSubcat = document.querySelector('#chosen');
            prevChosenSubcat.removeAttribute("id");

            button.setAttribute("id", "chosen");
            
            document.querySelector('.chosen_menu').textContent = button.textContent;
            //κώδικας για εναλλαγή των παραθύρων του menu
        })
    })

    document.querySelectorAll('.item').forEach(div => {
        div.addEventListener('click', function selectSize(event){
            
            let itemName = event.target.closest('.text-content');
            itemName = itemName.textContent;

            let amount = document.createElement('div');
            amount.className = 'amount';

            let chosen = document.querySelector('#chosen');
            if (chosen.innerHTML == 'Coffee'){

                let par = document.createElement('p');
                par.classList = 'par';
                par.innerHTML = 'size:';
                let size = document.createElement('div');
                size.className = 'size';
                let small = document.createElement('button');
                small.innerHTML = 'S';
                small.setAttribute('id', 'set');
                small.className = 'sizeButton'
                let medium = document.createElement('button');
                medium.innerHTML = 'M';
                medium.className = 'sizeButton';
                let large = document.createElement('button');
                large.innerHTML = 'L';
                large.className = 'sizeButton';
                size.appendChild(large);
                size.appendChild(medium);
                size.appendChild(small);
                amount.appendChild(par);
                amount.appendChild(size);
                div.removeEventListener('click', selectSize);
                div.appendChild(amount);

                document.querySelectorAll('.sizeButton').forEach(button => {
                    button.addEventListener('click', function(){
                        let prevSelectedSize = document.querySelector('#set');
                        prevSelectedSize.removeAttribute("id");
            
                        button.setAttribute("id", "set");
                    })
                })
            } 
            let countAndConfirm = document.createElement('div');
            countAndConfirm.className = 'countAndConfirm';
            let counter = document.createElement('div');
            counter.className = 'counter';
            let plus = document.createElement('button');
            plus.className = 'operations';
            plus.innerHTML = '+';
            let minus = document.createElement('button');
            minus.innerHTML = '-';
            minus.className = 'operations';
            let number = document.createElement('p');
            number.innerHTML = '1';
            number.className = 'operations';
            number.setAttribute('id','opText');
            counter.appendChild(plus);
            counter.appendChild(number);
            counter.appendChild(minus);

            let confirm = document.createElement('button');
            confirm.className = 'confirm';
            confirm.innerHTML = 'Add to Basket';

            countAndConfirm.appendChild(counter);
            countAndConfirm.appendChild(confirm);
            
            div.appendChild(countAndConfirm);
            document.querySelectorAll('.operations').forEach(button => {
                button.addEventListener('click', function (){
                const sum = document.querySelector('#opText');
                let innerSum = parseInt(sum.innerHTML,10);
                if (button.innerHTML === '+'){
                    sum.innerHTML = innerSum + 1;
                }
                else if (button.innerHTML === '-' && innerSum > 0){
                    sum.innerHTML = innerSum - 1;
                }
                });
            });
        })
    })

    
});
