import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const Realm = require('realm');

const CarSchema = {
  name: 'Car',
  properties: {
    make: 'string',
    model: 'string',
    miles: {type: 'int', default: 0},
    owners: {type: 'linkingObjects', objectType: 'Person', property: 'cars'},
  },
};
const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
    birthday: 'date',
    cars: 'Car[]',
    picture: 'string',
  },
};
const ExampleSchema = {
  name: 'PersonObject',
  properties: {
    name: 'string',
    age: 'double',
    married: {type: 'bool', default: false},
    children: {type: 'list', objectType: 'PersonObject'},
    parents: {
      type: 'linkingObjects',
      objectType: 'PersonObject',
      property: 'children',
    },
  },
};

var realm = new Realm({
  schema: [CarSchema, PersonSchema, ExampleSchema],
  schemaVersion: 0,
});

export default class App extends Component {
  state = {
    cars: null,
    people: null,
  };

  linkCarToPerson = () => {
    realm.write(function() {
      const myCar = realm.create('Car', {
        make: 'Honda',
        model: 'Civic',
        miles: 1000,
      });
      realm.create('Person', {
        name: 'Adrian',
        birthday: new Date(),
        picture: 'data',
        cars: [myCar],
      });
    });
  };

  linkExample = () => {
    console.log('make linking');
    realm.write(function() {
      const olivier = realm.create('PersonObject', {name: 'Olivier', age: 0});
      realm.create('PersonObject', {
        name: 'Christine',
        age: 25,
        children: [olivier],
      });
    });
  };

  showCarOwner = () => {
    const myCar = realm.objects('Car');
    console.log(myCar);
  };

  showExampleLinking = () => {
    const person = realm.objects('PersonObject');
    console.log(person);
  };

  componentDidMount() {
    this.setState({
      cars: realm.objects('Car') ? realm.objects('Car') : null,
      people: realm.objects('Person') ? realm.objects('Person') : null,
    });
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => this.linkCarToPerson()}>
          <Text style={{alignSelf: 'center', marginTop: 20}}>
            Link Car to Person
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.linkExample()}>
          <Text style={{alignSelf: 'center', marginTop: 20}}>Make Linking</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showCarOwner()}>
          <Text style={{alignSelf: 'center', marginTop: 20}}>
            Show the Car own
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.showExampleLinking()}>
          <Text style={{alignSelf: 'center', marginTop: 20}}>Show Linking</Text>
        </TouchableOpacity>

        <Text style={{alignSelf: 'center', marginTop: 20}}>
          Cars: {JSON.stringify(this.state.cars)}
        </Text>
        <Text style={{alignSelf: 'center', marginTop: 20}}>
          People: {JSON.stringify(this.state.people)}
        </Text>
      </View>
    );
  }
}
