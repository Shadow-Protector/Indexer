/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  VaultFactory,
  VaultFactory_AssetDeposited,
  VaultFactory_CancelDeposit,
  VaultFactory_OrderCancelled,
  VaultFactory_OrderCreated,
  VaultFactory_OrderExecuted,
  VaultFactory_OrderInventory,
  VaultFactory_VaultCreated,
} from "generated";

VaultFactory.AssetDeposited.handler(async ({ event, context }) => {
  const entity: VaultFactory_AssetDeposited = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    vaultAddress: event.params.vaultAddress,
    orderId: event.params.orderId,
  };

  context.VaultFactory_AssetDeposited.set(entity);
});

VaultFactory.CancelDeposit.handler(async ({ event, context }) => {
  const entity: VaultFactory_CancelDeposit = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    vaultAddress: event.params.vaultAddress,
    orderId: event.params.orderId,
  };

  context.VaultFactory_CancelDeposit.set(entity);
});
VaultFactory.OrderCancelled.handlerWithLoader({
  loader: async ({ event, context }) => {
    const order = await context.VaultFactory_OrderInventory.get(
      event.params.vaultAddress + event.params.orderId,
    );

    // Return the loaded data to the handler
    return {
      order,
    };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { order } = loaderReturn;
    if (order) {
      const existingOrder: VaultFactory_OrderInventory = {
        ...order,
        status: 3,
      };
      context.VaultFactory_OrderInventory.set(existingOrder);
    }

    const entity: VaultFactory_OrderCancelled = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      vaultAddress: event.params.vaultAddress,
      orderId: event.params.orderId,
    };

    context.VaultFactory_OrderCancelled.set(entity);
  },
});

VaultFactory.OrderCreated.handler(async ({ event, context }) => {
  const entity: VaultFactory_OrderCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _platform: event.params._platform,
    _platformAddress: event.params._platformAddress,
    _parameter: event.params._parameter,
    destinationChainId: event.params.destinationChainId,
    _salt: event.params._salt,
    conditionValue: event.params.conditionValue,
    vault: event.params.vault,
    orderId: event.params.orderId,
  };

  context.VaultFactory_OrderCreated.set(entity);

  context.log.debug(
    `OrderCreation: Processing  with id: ${event.params.vault + event.params.orderId} (debug)`,
  );

  const order: VaultFactory_OrderInventory = {
    id: event.params.vault + event.params.orderId,
    platform: event.params._platform,
    platformAddress: event.params._platformAddress,
    parameter: event.params._parameter,
    originChainId: BigInt(event.chainId),
    destinationChainId: event.params.destinationChainId,
    salt: event.params._salt,
    conditionValue: event.params.conditionValue,
    vault: event.params.vault,
    orderId: event.params.orderId,
    status: 1,
    solverTransaction: "",
  };

  context.VaultFactory_OrderInventory.set(order);
});

VaultFactory.OrderExecuted.handlerWithLoader({
  loader: async ({ event, context }) => {
    const order = await context.VaultFactory_OrderInventory.get(
      event.params.vaultAddress + event.params.orderId,
    );

    context.log.debug(
      `OrderExecution_Loader: Processing  with id: ${event.params.vaultAddress + event.params.orderId} (debug)`,
    );

    // Return the loaded data to the handler
    return {
      order,
    };
  },

  handler: async ({ event, context, loaderReturn }) => {
    const { order } = loaderReturn;
    context.log.debug(
      `OrderExecution_Handler: Processing  order: ${order ? order.id : "Empty"} (debug)`,
    );

    if (order) {
      const existingOrder: VaultFactory_OrderInventory = {
        ...order,
        status: 2,
        solverTransaction: event.transaction.hash,
      };
      context.VaultFactory_OrderInventory.set(existingOrder);
    }

    const entity: VaultFactory_OrderExecuted = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      vaultAddress: event.params.vaultAddress,
      orderId: event.params.orderId,
    };

    context.VaultFactory_OrderExecuted.set(entity);
  },
});

VaultFactory.VaultCreated.handler(async ({ event, context }) => {
  const entity: VaultFactory_VaultCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    vaultAddress: event.params.vaultAddress,
    owner: event.params.owner,
  };

  context.VaultFactory_VaultCreated.set(entity);
});
