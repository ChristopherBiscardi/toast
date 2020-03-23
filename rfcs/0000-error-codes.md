- Feature Name: error-codes
- Start Date: 2020-03-15
- RFC PR:
  [christopherbiscardi/toast#0000](https://github.com/christopherbiscardi/toast/pull/0000)
- Toast Issue:
  [christopherbiscardi/toast#0000](https://github.com/christopherbiscardi/toast/issues/0000)

# Summary

Error codes should be standardized and descriptions separated out into codes
rather than dumping out string errors.

# Motivation

Errors should be deterministic for users and more information should be easily
discoverable. "something went wrong" is worse than "Error Code #212: something
went wrong" where 212 is defined well in a single place with the other error
codes.

# Guide-level explanation

# Reference-level explanation

This is the technical portion of the RFC. Explain the design in sufficient
detail that:

- Its interaction with other features is clear.
- It is reasonably clear how the feature would be implemented.
- Corner cases are dissected by example.

The section should return to the examples given in the previous section, and
explain more fully how the detailed proposal makes those examples work.

## Drawbacks

More work.

## Rationale and alternatives

- Why is this design the best in the space of possible designs?

The alternatives are basically unstructured, uncontrolled errors.

- What is the impact of not doing this?

Confusion for users. Needing to grep the codebase to find where an error is
occurring.

## Prior Art

- Rust does this, and
  [displays the codes on a website with runnable examples](https://doc.rust-lang.org/error-index.html)
- TypeScript
  [does this](https://github.com/microsoft/TypeScript/blob/b8baf4804370a4405f7f123db5bbb4530297982b/src/compiler/diagnosticMessages.json)
- React [prints out website links](https://reactjs.org/docs/error-decoder.html/)
  that can be decoded from minified files.

## Future Possibilities

Some kind of error package might be cool.
