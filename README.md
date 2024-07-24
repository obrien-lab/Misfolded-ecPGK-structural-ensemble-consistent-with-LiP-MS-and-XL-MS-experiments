# Misfolded ecPGK structures predicted by coarse-grained protein refolding simulations
This is a webapp for visualizing the misfolded structual ensemble of ecPGK that are prediced by simulations and are consistent with structual changes identified in LiP-MS and XL-MS experiments.

The input files and scripts used to test the consistency and select representative structural ensembles are provided in the folder `Scripts and input files/`. We also provide the input files to generate the simulation trajectories. However, we are not able to upload the large amount of trajectories to this repository.

You can use the following commands to combine the compressed parts and extract the files:
```bash
cat input_files.tar.xz.part.* > input_files.tar.xz
xz -d input_data.tar.xz
tar -xvf input_data.tar
```

Please reference our paper for more details:
TBA
