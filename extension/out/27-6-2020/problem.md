# Reddit Challenge (by Daily Problem)

## from r&#x2F;dailyprogrammer

For the purpose of this challenge, a *k-ary necklace of length n* is a sequence of n letters chosen from k options, e.g. &#x60;ABBEACEEA&#x60; is a 5-ary necklace of length 9. Note that not every letter needs to appear in the necklace. Two necklaces are equal if you can move some letters from the beginning to the end to make the other one, otherwise maintaining the order. For instance, &#x60;ABCDE&#x60; is equal to &#x60;DEABC&#x60;. For more detail, see [challenge #383 Easy: Necklace matching](https:&#x2F;&#x2F;www.reddit.com&#x2F;r&#x2F;dailyprogrammer&#x2F;comments&#x2F;ffxabb&#x2F;20200309_challenge_383_easy_necklace_matching&#x2F;).

Today&#39;s challenge is, given k and n, find the number of *distinct* k-ary necklaces of length n. That is, the size of the largest set of k-ary necklaces of length n such that no two of them are equal to each other. You do not need to actually generate the necklaces, just count them.

For example, there are 24 distinct 3-ary necklaces of length 4, so &#x60;necklaces(3, 4)&#x60; is &#x60;24&#x60;. Here they are:

    AAAA  BBBB  CCCC
    AAAB  BBBC  CCCA
    AAAC  BBBA  CCCB
    AABB  BBCC  CCAA
    ABAB  BCBC  CACA
    AABC  BBCA  CCAB
    AACB  BBAC  CCBA
    ABAC  BCBA  CACB

You only need to handle inputs such that k^n &amp;lt; 10,000.

    necklaces(2, 12) &#x3D;&amp;gt; 352
    necklaces(3, 7) &#x3D;&amp;gt; 315
    necklaces(9, 4) &#x3D;&amp;gt; 1665
    necklaces(21, 3) &#x3D;&amp;gt; 3101
    necklaces(99, 2) &#x3D;&amp;gt; 4950

The most straightforward way to count necklaces is to generate all k^n patterns, and deduplicate them (potentially using your code from Easy #383). This is an acceptable approach for this challenge, as long as you can actually run your program through to completion for the above examples.

# Optional optimization

A more efficient way is with the formula:

    necklaces(k, n) &#x3D; 1&#x2F;n * Sum of (phi(a) k^b)
        for all positive integers a,b such that a*b &#x3D; n.

For example, the ways to factor 10 into two positive integers are 1x10, 2x5, 5x2, and 10x1, so:

    necklaces(3, 10)
        &#x3D; 1&#x2F;10 (phi(1) 3^10 + phi(2) 3^5 + phi(5) 3^2 + phi(10) 3^1)
        &#x3D; 1&#x2F;10 (1 * 59049 + 1 * 243 + 4 * 9 + 4 * 3)
        &#x3D; 5934

&#x60;phi(a)&#x60; is [Euler&#39;s totient function](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Euler%27s_totient_function), which is the number of positive integers &#x60;x&#x60; less than or equal to &#x60;a&#x60; such that [the greatest common divisor](https:&#x2F;&#x2F;en.wikipedia.org&#x2F;wiki&#x2F;Greatest_common_divisor) of &#x60;x&#x60; and &#x60;a&#x60; is 1. For instance, phi(12) &#x3D; 4, because 1, 5, 7, and 11 are coprime with 12.

An efficient way to compute &#x60;phi&#x60; is with the formula:

    phi(a) &#x3D; a * Product of (p-1) &#x2F; Product of (p)
        for all distinct prime p that divide evenly into a.

For example, for &#x60;a &#x3D; 12&#x60;, the primes that divide &#x60;a&#x60; are 2 and 3. So:

    phi(12) &#x3D; 12 * ((2-1)*(3-1)) &#x2F; (2*3) &#x3D; 12 * 2 &#x2F; 6 &#x3D; 4

If you decide to go this route, you can test much bigger examples.

    necklaces(3, 90) &#x3D;&amp;gt; 96977372978752360287715019917722911297222
    necklaces(123, 18) &#x3D;&amp;gt; 2306850769218800390268044415272597042
    necklaces(1234567, 6) &#x3D;&amp;gt; 590115108867910855092196771880677924
    necklaces(12345678910, 3) &#x3D;&amp;gt; 627225458787209496560873442940

If your language doesn&#39;t easily let you handle such big numbers, that&#39;s okay. But your program should run much faster than O(k^(n)).
