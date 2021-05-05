import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import CryptoUtils from '../uniris/crypto';
import Utilities from '../uniris/utilities';


@Component({
  selector: 'app-uniris-address-generator',
  templateUrl: './uniris-address-generator.component.html',
  styleUrls: ['./uniris-address-generator.component.scss'],
})


export class UnirisAddressGeneratorComponent implements OnInit {

  title: string = 'Address generator';
  userPrivateKey: string = '';
  userPublicKey: string = '';
  Curves: any = [
    { name: 'Ed25519', value: 'ed25519' },
    { name: 'NIST-P256', value: 'P256' },
    { name: 'Ed2secp256k15519', value: 'secp256k1' },
  ];
  HashsAlgo: any = [
    { name: 'SHA-512', value: 'sha512' },
    { name: 'SHA3-256', value: 'sha3-256' },
    { name: 'SHA3-512', value: 'sha3-512' },
    { name: 'Blake2b', value: 'blake2b' },
  ];

  constructor() { }

  ngOnInit(): void {}

  form = new FormGroup({
    seed: new FormControl('', [Validators.required, Validators.minLength(3)]),
    index: new FormControl('', [Validators.required, Validators.minLength(1)]),
    curve: new FormControl('', [Validators.required]),
    hash: new FormControl('', [Validators.required])
  });

  get f() {
    return this.form.controls;
  }

  public generateAddress (this: any, formValues) {
    const { privateKey, publicKey } = CryptoUtils.deriveKeyPair(
      formValues.seed,
      formValues.index,
      formValues.curve
    );
    
    this.userPrivateKey = Utilities.uint8ArrayToHex(privateKey);
    this.userPublicKey = Utilities.uint8ArrayToHex(publicKey);
    
  };



  submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.generateAddress(this.form.value);

    } 
  }
}
