export default function assert(label, thing) {
  console.log(
    ' ', (thing ? '√'.green : 'X'.red), label[thing ? 'green' : 'red']
  );
  if (!thing) {
    throw new Error(label);
  }
}
