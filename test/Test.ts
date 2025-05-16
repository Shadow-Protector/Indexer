import assert from "assert";
import { 
  TestHelpers,
  VaultFactory_AssetDeposited
} from "generated";
const { MockDb, VaultFactory } = TestHelpers;

describe("VaultFactory contract AssetDeposited event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for VaultFactory contract AssetDeposited event
  const event = VaultFactory.AssetDeposited.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("VaultFactory_AssetDeposited is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await VaultFactory.AssetDeposited.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualVaultFactoryAssetDeposited = mockDbUpdated.entities.VaultFactory_AssetDeposited.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedVaultFactoryAssetDeposited: VaultFactory_AssetDeposited = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      vaultAddress: event.params.vaultAddress,
      orderId: event.params.orderId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualVaultFactoryAssetDeposited, expectedVaultFactoryAssetDeposited, "Actual VaultFactoryAssetDeposited should be the same as the expectedVaultFactoryAssetDeposited");
  });
});
