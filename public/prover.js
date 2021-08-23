
export async function calculateProof(preImage, hash) {
    const { proof, publicSignals } =
      await snarkjs.groth16.fullProve({ x: preImage, hash: hash.toString() }, 
      "/circuit/circuit.wasm", "/circuit/circuit_final.zkey");

    const solidityProof = await groth16ExportSolidityCallData(proof, publicSignals)
  
    return solidityProof;
}

  function p256(n) {
    let nstr = BigInt(n).toString(16);
    while (nstr.length < 64) nstr = "0"+nstr;
    nstr = `"0x${nstr}"`;

    return nstr;
}

async function groth16ExportSolidityCallData(proof, pub) {

    let inputs = "";
    for (let i=0; i<pub.length; i++) {
        if (inputs != "") inputs = inputs + ",";
        inputs = inputs + p256(pub[i]);
    }

    let S;
    S=`[${p256(proof.pi_a[0])}, ${p256(proof.pi_a[1])}],` +
        `[[${p256(proof.pi_b[0][1])}, ${p256(proof.pi_b[0][0])}],[${p256(proof.pi_b[1][1])}, ${p256(proof.pi_b[1][0])}]],` +
        `[${p256(proof.pi_c[0])}, ${p256(proof.pi_c[1])}],` +
        `[${inputs}]`;

    return S;
}
