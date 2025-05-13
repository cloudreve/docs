# Boolset Encoding and Decoding {#boolset-encoding-and-decoding}

Boolset is an encoding method used to represent a set of boolean values. It converts a set of boolean values into a string for easy storage and transmission. In Cloudreve's API, Boolset is typically used for permission settings, such as user group permissions and file permissions.

## Internal Representation {#internal-representation}

The `BooleanSet` type is essentially a byte slice (`[]byte`). In this slice, each bit represents a boolean value (permission switch).

- The `0`th flag bit corresponds to the `0`th bit of the `0`th byte in the byte slice.
- The `1`st flag bit corresponds to the `1`st bit of the `0`th byte in the byte slice.
- ...
- The `7`th flag bit corresponds to the `7`th bit of the `0`th byte in the byte slice.
- The `8`th flag bit corresponds to the `0`th bit of the `1`st byte in the byte slice.
- And so on...

A bit value of `1` indicates the corresponding flag is `true` (enabled), while `0` indicates `false` (disabled).

## Encoding Process {#encoding-process}

1.  **Determine Maximum Index**: Find the maximum index `max_n` among all flags to be represented.
2.  **Calculate Byte Count**: Determine the number of bytes required. At least `floor(max_n / 8) + 1` bytes are needed to accommodate all flags.
3.  **Initialize Byte Sequence**: Create a byte sequence with the required number of bytes, initializing all bytes to `0`.
4.  **Set Flags**: For each flag `n` that needs to be set to `true`:
    - Locate the `byte_index = floor(n / 8)`th byte in the byte sequence.
    - Calculate the bit index within that byte: `bit_index = n % 8`.
    - Set the `bit_index`th bit of that byte to `1`. This is typically done using a Bitwise OR operation: `byte[byte_index] = byte[byte_index] | (1 << bit_index)`.
5.  **Base64 Encode**: Encode the final byte sequence into a Base64 string.

## Decoding Process {#decoding-process}

1.  **Base64 Decode**: First, decode the Base64 string back into the original byte sequence.
2.  **Check Flag**: To check the status (`true` or `false`) of a specific flag `n`:
    - Calculate the byte index: `byte_index = floor(n / 8)`.
    - **Boundary Check**: Check if `byte_index` is within the valid range of the byte sequence. If it's out of range, the flag is implicitly `false` (because it was never set).
    - If `byte_index` is valid, locate the `byte_index`th byte in the sequence.
    - Calculate the bit index: `bit_index = n % 8`.
    - Check the value of the `bit_index`th bit of that byte. This is typically done using a Bitwise AND operation: `is_set = (byte[byte_index] & (1 << bit_index)) != 0`.
    - If the result is non-zero, flag `n` is `true`; otherwise, it is `false`.

## Programming Language Implementation {#programming-language-implementation}

### Golang

[boolset.go](https://github.com/cloudreve/Cloudreve/blob/master/pkg/boolset/boolset.go)

```go
// Load from string
bs, err := boolset.FromString("/f8B")
if err != nil {
	return nil, err
}

// Read the 5th flag bit
fmt.Println(bs.Enabled(5))

// Set the 1st flag bit
boolset.Set(1, true, bs)

// Save to string
encoded, err := bs.String()
if err != nil {
	return nil, err
}
```

### TypeScript

[boolset.ts](https://github.com/cloudreve/frontend/blob/master/src/util/boolset.ts)

```typescript
// Load from string
const bs = new Boolset("/f8B");

// Read the 5th flag bit
console.log(bs.enabled(5));

// Set the 1st flag bit
bs.set(1, true);

// Save to string
const encoded = bs.toString();
```

## Flag Definition {#flag-definition}

### User Group Permissions {#group-permission}

| Flag Bit | Description                                          |
| -------- | ---------------------------------------------------- |
| `0`      | Is administrator                                     |
| `1`      | Is anonymous user group                              |
| `2`      | Can share files                                      |
| `3`      | Can access WebDAV                                    |
| `4`      | Can perform server-side batch download               |
| `5`      | Can execute archive compression tasks                |
| `6`      | Can enable WebDAV proxy                              |
| `7`      | Can download shares from others                      |
| `8`      | Can download shares for free                         |
| `9`      | Can perform remote downloads                         |
| `10`     | Can relocate storage policy                          |
| `11`     | Use redirect direct link                             |
| `12`     | Can use advanced delete options                      |
| `13`     | Can select specific node to process tasks            |
| `14`     | Can set higher share permissions for anonymous users |

### File Permissions {#file-permission}

| Flag Bit | Description |
| -------- | ----------- |
| `0`      | Read        |
| `1`      | Update      |
| `2`      | Create      |
| `3`      | Delete      |

### Node Functions {#node-function}

| Flag Bit | Description             |
| -------- | ----------------------- |
| `0`      | Reserved, do not use    |
| `1`      | Create compressed file  |
| `2`      | Decompress file         |
| `3`      | Remote download         |
| `4`      | Transfer storage policy |
