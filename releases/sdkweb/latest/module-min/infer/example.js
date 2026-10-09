const result=await new I6Sdk().infer().run({modelName:"relevance-fashion-fbt",modelVersion:"v1",partitions:{store_id:"s1"},dataset:"dectest",params:{skus:[{sku_id:"150"},{sku_id:"77"}]}});
