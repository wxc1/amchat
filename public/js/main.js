class Animal {
    constructor(name, height, weight){
        console.log('Animal', name, height, weight)
        this.name = name;
        this.height = height;
        this.weight = weight;
    }
    nameLength(){
        return this.name.length;
    }
}

let dog = new Animal("Fido", 25, 90)
console.log("name len", dog.nameLength()) 


class Dog extends Animal {
    constructor(name, height, weight,barkVolume, leashColor) {
        super(name, height, weight);
        this.barkVolume = barkVolume;
        this.leashColor = leashColor;

    }
    bark() {
        if(this.barkVolume > 50) {
            console.log(this.name, "Barks loudly!");

        }else {
            console.log(this.name, "barks timitdly");
        }
    }
}

const king = new Dog("King", 45, 92,72,"red")

king.bark()