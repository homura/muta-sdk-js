const { createServiceBindingClass, read, write } = require('@mutadev/service');

// recommend using TypeScript to create binding
const AssetService = createServiceBindingClass({
  serviceName: 'asset',
  read: {
    get_asset: read(),
  },
  write: {
    create_asset: write(),
  },
});

// same with example-006
async function main() {
    const service = new AssetService();

    const tokenName = 'My Token' + Math.random();
    // creating asset requires wait for consensus successful,
    // which takes a few seconds
    const createdAsset = await service.write.create_asset({
      name: tokenName,
      supply: 10000,
      symbol: 'MT',
    });
    const assetId = createdAsset.response.response.succeedData.id;
    console.log(`create asset id is: [${assetId}]`);
  
    // after successfully creating an asset,
    // we can find it on Muta
    const asset = await service.read.get_asset({ id: assetId });
    console.log(`found [${asset.succeedData.name}] was created on Muta`);
}

main();